import { z } from 'zod';
import type { CVData } from '@/types/cv';

export const coverLetterResponseSchema = z.object({
  letter: z.string(),
});

export const geminiResponseFormat = {
  type: 'object',
  properties: {
    letter: { type: 'string' },
  },
  required: ['letter'],
};

export function buildCoverLetterPrompt(args: {
  cvData: CVData;
  jobDescription?: string;
  language: string;
}): string {
  const { cvData, jobDescription, language } = args;

  const langName = language === 'es' ? 'Spanish' : 'English';

  const summary = cvData.summary[language as 'es' | 'en'] || '';
  const experience = cvData.experience
    .map(
      (e) =>
        `${e.company} — ${e.position[language as 'es' | 'en'] || ''}\n${e.descriptions[language as 'es' | 'en'] || ''}`
    )
    .join('\n');
  const education = cvData.education
    .map(
      (e) =>
        `${e.institution} — ${e.degree[language as 'es' | 'en'] || ''} (${e.field[language as 'es' | 'en'] || ''})`
    )
    .join('\n');
  const skills = cvData.skills
    .map((s) => `${s.category}: ${s.skills.join(', ')}`)
    .join('\n');

  const jobSection = jobDescription
    ? `\nJOB DESCRIPTION:\n"""\n${jobDescription}\n"""\n`
    : '';

  return `Write a professional cover letter in ${langName}.

CRITICAL RULES:
- Use a formal, professional register appropriate for ${langName} business correspondence.
- Sound NATURAL and HUMAN — avoid AI clichés, robotic phrasing, formulaic openings, and excessive adjectives. Write as a real person would write a genuine letter.
- NEVER invent experience, skills, achievements, metrics, or contact information.
- Reference specific requirements from the job description and connect them to the candidate's REAL background (experience, skills, education).
- Do NOT include the sender's name, address, email, or phone in the body — those will be added separately.
- Do NOT include a date line — it will be added separately.
- 3-4 paragraphs, professional but warm, fits one page.
- Use proper formal greeting and closing conventions for ${langName} business letters.
- Output ONLY the letter text (greeting → body paragraphs → formal closing → optional signature placeholders like "[Your Name]" are fine as the closing line). No meta-commentary, no explanations.

CANDIDATE BACKGROUND:
Name: ${cvData.personalInfo.name}
Professional Summary: ${summary || '(not provided)'}
Work Experience:
${experience || '(not provided)'}
Education:
${education || '(not provided)'}
Key Skills:
${skills || '(not provided)'}
${jobSection}
Generate a ${langName} cover letter now. Length: ~250-350 words. Return ONLY the letter text as a single string in the "letter" field of the JSON output.`;
}
