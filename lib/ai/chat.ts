import { z } from 'zod';
import type { CVData } from '@/types/cv';
import type { Suggestion } from '@/types/chat';
import { getCurrentValue, verifyEntryExists } from '@/lib/cv/suggestions';

const flatSuggestionSchema = z.object({
  section: z.enum(['summary', 'experience', 'education']),
  entryId: z.string().optional(),
  field: z.enum(['position', 'descriptions', 'degree', 'field']).optional(),
  lang: z.enum(['es', 'en']),
  current: z.string(),
  proposed: z.string(),
  rationale: z.string(),
});

export const chatResponseSchema = z.object({
  reply: z.string(),
  suggestions: z.array(flatSuggestionSchema).max(5).default([]),
});

export const geminiResponseFormat = {
  type: 'object',
  properties: {
    reply: { type: 'string' },
    suggestions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          section: { type: 'string', enum: ['summary', 'experience', 'education'] },
          entryId: { type: 'string', description: 'Required for experience/education sections. The id from the provided CV data.' },
          field: { type: 'string', enum: ['position', 'descriptions', 'degree', 'field'], description: 'Required for experience/education sections.' },
          lang: { type: 'string', enum: ['es', 'en'] },
          current: { type: 'string', description: 'The exact current value from the CV data. Must match verbatim.' },
          proposed: { type: 'string' },
          rationale: { type: 'string', description: 'Brief explanation of the change in the user\'s language.' },
        },
        required: ['section', 'lang', 'current', 'proposed', 'rationale'],
      },
    },
  },
  required: ['reply', 'suggestions'],
};

function flatSuggestionToTyped(sug: z.infer<typeof flatSuggestionSchema>): Suggestion | null {
  const id = crypto.randomUUID();

  switch (sug.section) {
    case 'summary':
      return { id, target: { kind: 'summary', lang: sug.lang }, current: sug.current, proposed: sug.proposed, rationale: sug.rationale };
    case 'experience': {
      if (!sug.entryId || !sug.field || (sug.field !== 'position' && sug.field !== 'descriptions')) return null;
      return { id, target: { kind: 'experience', entryId: sug.entryId, field: sug.field, lang: sug.lang }, current: sug.current, proposed: sug.proposed, rationale: sug.rationale };
    }
    case 'education': {
      if (!sug.entryId || !sug.field || (sug.field !== 'degree' && sug.field !== 'field')) return null;
      return { id, target: { kind: 'education', entryId: sug.entryId, field: sug.field, lang: sug.lang }, current: sug.current, proposed: sug.proposed, rationale: sug.rationale };
    }
  }
}

export function sanitizeSuggestions(rawSuggestions: unknown[], cvData: CVData): Suggestion[] {
  if (!Array.isArray(rawSuggestions)) return [];

  return rawSuggestions
    .map((raw) => {
      const parsed = flatSuggestionSchema.safeParse(raw);
      if (!parsed.success) return null;

      const typed = flatSuggestionToTyped(parsed.data);
      if (!typed) return null;

      return typed;
    })
    .filter((s): s is Suggestion => {
      if (!s) return false;
      if (!verifyEntryExists(cvData, s.target)) return false;

      const actual = getCurrentValue(cvData, s.target);
      if (actual === null) return false;
      if (actual.trim() !== s.current.trim()) return false;
      if (s.proposed === s.current) return false;

      return true;
    });
}

export function buildChatPrompt(args: {
  message: string;
  history: { role: string; content: string }[];
  cvData: CVData;
  jobDescription?: string;
  language: string;
}): string {
  const { message, history, cvData, jobDescription, language } = args;

  const langName = language === 'es' ? 'Spanish' : 'English';

  const cvSummary = cvData.summary[language as 'es' | 'en'] || '';
  const cvExperience = cvData.experience
    .map(
      (e) =>
        `[ID: ${e.id}] ${e.company} — ${e.position[language as 'es' | 'en'] || ''}\n${e.descriptions[language as 'es' | 'en'] || ''}`
    )
    .join('\n---\n');
  const cvEducation = cvData.education
    .map(
      (e) =>
        `[ID: ${e.id}] ${e.institution} — ${e.degree[language as 'es' | 'en'] || ''} (${e.field[language as 'es' | 'en'] || ''})`
    )
    .join('\n');
  const cvSkills = cvData.skills
    .map((s) => `${s.category}: ${s.skills.join(', ')}`)
    .join('\n');
  const cvLanguages = cvData.languages
    .map((l) => `${l.language} (${l.level})`)
    .join(', ');

  const historyText =
    history.length > 0
      ? history
          .slice(-10)
          .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
          .join('\n')
      : '';

  const jobSection = jobDescription
    ? `\nJOB DESCRIPTION:\n"""\n${jobDescription}\n"""\n`
    : '';

  return `You are an expert CV writer helping the user adapt their resume to job postings.
Respond in ${langName}. Be concise and helpful.

CRITICAL RULES:
- NEVER invent experience, skills, certifications, achievements, or metrics the user does not have.
- Only rephrase, emphasize, or reorder content that exists in the user's CV data.
- Preserve all numbers, dates, company names, and proper nouns exactly as they appear.
- Incorporate job keywords from the job description ONLY where truthful.
- Use ATS-friendly phrasing: action verbs, specific results, concise bullets.
- If the user asks something outside CV editing, reply conversationally with an empty suggestions array.

CV DATA (${langName} content):
Name: ${cvData.personalInfo.name}
Summary: ${cvSummary || '(none)'}
Experience:
${cvExperience || '(none)'}
Education:
${cvEducation || '(none)'}
Skills:
${cvSkills || '(none)'}
Languages: ${cvLanguages || '(none)'}
${jobSection}
${historyText ? `CONVERSATION HISTORY:\n${historyText}\n` : ''}
USER MESSAGE: ${message}

Return a JSON object with:
- "reply": your conversational response in ${langName}
- "suggestions": array of concrete edits (max 5). For each:
  - "section": "summary" | "experience" | "education"
  - "entryId": the entry's ID from CV data (required for experience/education)
  - "field": for experience->"position"|"descriptions", for education->"degree"|"field"
  - "lang": "${language}"
  - "current": the EXACT current text from the CV data above (copy-paste it verbatim)
  - "proposed": your improved version
  - "rationale": brief explanation in ${langName}
Leave suggestions empty if no concrete edits are warranted.`;
}
