import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

/* ── Request / Response schemas ──────────────── */

const cvDataSchema = z.object({
  personalInfo: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    linkedin: z.string().optional(),
    website: z.string().optional(),
  }),
  summary: z.object({ es: z.string().optional(), en: z.string().optional() }),
  experience: z.array(
    z.object({
      position: z.object({ es: z.string().optional(), en: z.string().optional() }),
      company: z.string(),
      descriptions: z.object({ es: z.string().optional(), en: z.string().optional() }),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }),
  ),
  education: z.array(
    z.object({
      degree: z.object({ es: z.string().optional(), en: z.string().optional() }),
      field: z.object({ es: z.string().optional(), en: z.string().optional() }),
      institution: z.string(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }),
  ),
  skills: z.array(z.object({ category: z.string(), skills: z.array(z.string()) })),
  languages: z.array(z.object({ language: z.string(), level: z.string() })),
  language: z.enum(['es', 'en']),
});

const jobMatcherRequestSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  model: z.enum(['flash', 'pro']),
  tone: z.enum(['quantitative', 'concise', 'executive']),
  jobDescription: z.string().min(1, 'Job description is required'),
  cvData: cvDataSchema,
});

const bulletSuggestionSchema = z.object({
  originalText: z.string(),
  adaptedText: z.string(),
  position: z.string(),
  period: z.string(),
  matchPointsGained: z.number(),
  keywordsIntegrated: z.number(),
});

const jobMatcherResponseSchema = z.object({
  matchScore: z.number(),
  technicalMatch: z.number(),
  atsStructure: z.number(),
  softSkillsMatch: z.number(),
  foundKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  suggestions: z.array(bulletSuggestionSchema),
});

/** Map client model shorthand to Gemini model ID */
function resolveModelName(model: 'flash' | 'pro'): string {
  return model === 'pro' ? 'gemini-2.5-pro' : 'gemini-3.6-flash';
}

/* ── Gemini response format ──────────────────── */

const geminiResponseFormat = {
  type: 'object',
  properties: {
    matchScore: { type: 'number', description: 'Overall compatibility score (0-100)' },
    technicalMatch: { type: 'number', description: 'Technical skills alignment (0-100)' },
    atsStructure: { type: 'number', description: 'How well the JD is structured for ATS (0-100)' },
    softSkillsMatch: { type: 'number', description: 'Soft skills alignment (0-100)' },
    foundKeywords: {
      type: 'array',
      items: { type: 'string' },
      description: 'Keywords from JD found in CV (max 8)',
    },
    missingKeywords: {
      type: 'array',
      items: { type: 'string' },
      description: 'Important keywords from JD missing in CV (max 5)',
    },
    suggestions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          originalText: { type: 'string', description: 'Exact text from the CV bullet point' },
          adaptedText: { type: 'string', description: 'Improved version with JD keywords integrated' },
          position: { type: 'string', description: 'Job title where this bullet belongs' },
          period: { type: 'string', description: 'Date range of the position' },
          matchPointsGained: { type: 'number', description: 'Estimated score improvement (5-30)' },
          keywordsIntegrated: { type: 'number', description: 'How many JD keywords were added (1-6)' },
        },
        required: ['originalText', 'adaptedText', 'position', 'period', 'matchPointsGained', 'keywordsIntegrated'],
      },
      description: 'Array of bullet adaptations (max 3)',
    },
  },
  required: ['matchScore', 'technicalMatch', 'atsStructure', 'softSkillsMatch', 'foundKeywords', 'missingKeywords', 'suggestions'],
};

/* ── Prompt builder ──────────────────────────── */

function buildJobMatcherPrompt(
  jobDescription: string,
  cvData: z.infer<typeof cvDataSchema>,
  tone: 'quantitative' | 'concise' | 'executive',
): string {
  const lang = cvData.language;
  const langLabel = lang === 'es' ? 'Spanish' : 'English';

  const toneGuidance: Record<string, string> = {
    quantitative: `TONE: QUANTITATIVE ATS
- Prioritize metrics, percentages, dollar amounts, team sizes, and measurable outcomes
- Transform vague statements into data-driven achievements
- Use specific numbers wherever possible (e.g., "increased sales by 35%" not "improved sales")
- Focus on ROI, efficiency gains, and quantifiable impact`,
    concise: `TONE: CONCISE DIRECT
- Maximum brevity with direct impact
- Eliminate filler words and unnecessary qualifiers
- Each bullet should be punchy and action-oriented (10-20 words ideal)
- Get straight to the point — no fluff, no padding
- Use strong, single-word action verbs at the start`,
    executive: `TONE: EXECUTIVE C-LEVEL
- Strategic leadership language and executive positioning
- Emphasize vision, transformation, and organizational impact
- Use C-suite terminology: "spearheaded", "orchestrated", "drove strategic initiative"
- Focus on business outcomes, stakeholder management, and board-level results
- Position the candidate as a decision-maker and thought leader`,
  };

  // Build CV summary for prompt
  const summaryText = cvData.summary[lang] || cvData.summary.es || cvData.summary.en || '';

  const experienceText = cvData.experience
    .map((exp) => {
      const pos = exp.position[lang] || exp.position.es || exp.position.en || '';
      const desc = exp.descriptions[lang] || exp.descriptions.es || exp.descriptions.en || '';
      const dates = [exp.startDate, exp.endDate || 'Present'].filter(Boolean).join(' — ');
      return `- ${pos} at ${exp.company} (${dates})\n  ${desc}`;
    })
    .join('\n');

  const skillsText = cvData.skills
    .map((cat) => `${cat.category}: ${cat.skills.join(', ')}`)
    .join('\n');

  const educationText = cvData.education
    .map((edu) => {
      const degree = edu.degree[lang] || edu.degree.es || edu.degree.en || '';
      const field = edu.field[lang] || edu.field.es || edu.field.en || '';
      return `- ${degree} en ${field} — ${edu.institution}`;
    })
    .join('\n');

  const languagesText = cvData.languages
    .map((l) => `${l.language} (${l.level})`)
    .join(', ');

  return `You are an expert ATS (Applicant Tracking Systems) consultant.

Analyze the compatibility between this JOB DESCRIPTION and the candidate's CV.
Provide concrete metrics and actionable suggestions.

${toneGuidance[tone]}

JOB DESCRIPTION:
"""
${jobDescription}
"""

CANDIDATE CV:
"""
Name: ${cvData.personalInfo.name} | Location: ${cvData.personalInfo.location}

Summary: ${summaryText}

Experience:
${experienceText}

Education:
${educationText}

Skills:
${skillsText}

Languages: ${languagesText}
"""

CRITICAL RULES:
- NEVER invent experience, skills, or achievements not present in the CV
- Only suggest rephrasing or emphasizing existing content
- Preserve all numbers, dates, company names exactly as they appear
- Suggest max 3 bullet adaptations (prioritize most impactful)
- Each suggestion must reference a REAL bullet from the CV
- Do NOT fabricate keywords — only report keywords actually found or actually missing
- All score values must be between 0 and 100
- Return ONLY the JSON object, no additional text

Return JSON with:
- matchScore: overall compatibility (0-100)
- technicalMatch: technical skills alignment (0-100)
- atsStructure: how well the JD is structured for ATS (0-100)
- softSkillsMatch: soft skills alignment (0-100)
- foundKeywords: keywords from JD found in CV (max 8)
- missingKeywords: important keywords from JD missing in CV (max 5)
- suggestions: array of bullet adaptations (max 3)
  - originalText: exact text from CV
  - adaptedText: improved version with JD keywords
  - position: job title where this bullet belongs
  - period: date range
  - matchPointsGained: estimated score improvement (5-30)
  - keywordsIntegrated: how many JD keywords were added (1-6)

Respond in ${langLabel}.`;
}

/* ── POST handler ────────────────────────────── */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = jobMatcherRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { apiKey, model, tone, jobDescription, cvData } = parsed.data;

    const prompt = buildJobMatcherPrompt(jobDescription, cvData, tone);

    const client = new GoogleGenAI({ apiKey });

    const interaction = await client.interactions.create({
      model: resolveModelName(model),
      input: prompt,
      response_format: geminiResponseFormat as any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Gemini SDK expects raw JSON schema type incompatible with TS
    });

    const rawText = interaction.output_text;
    if (!rawText) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    const aiResult = JSON.parse(rawText);
    const validated = jobMatcherResponseSchema.parse(aiResult);

    return NextResponse.json(validated);
  } catch (error) {
    console.error('AI job-matcher error:', error);
    const message = error instanceof Error ? error.message : 'Failed to analyze job description';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
