import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

/* ── Request / Response schemas ──────────────── */

const improveRequestSchema = z.object({
  section: z.enum(['summary', 'experience', 'education', 'skills', 'languages']),
  content: z.string().min(1, 'Content is required'),
  lang: z.enum(['es', 'en']),
  context: z.string().optional(),
  apiKey: z.string().min(1, 'API key is required'),
  model: z.enum(['flash', 'pro']),
  tone: z.enum(['quantitative', 'concise', 'executive']),
});

/** Map client model shorthand to Gemini model ID */
function resolveModelName(model: 'flash' | 'pro'): string {
  return model === 'pro' ? 'gemini-2.5-pro' : 'gemini-3.6-flash';
}

const suggestionSchema = z.object({
  original: z.string(),
  improved: z.string(),
  reason: z.string(),
  type: z.enum(['verb', 'metric', 'length', 'keyword', 'clarity']),
});

const improveResponseSchema = z.object({
  suggestions: z.array(suggestionSchema),
});

/* ── Gemini response format ──────────────────── */

const geminiResponseFormat = {
  type: 'object',
  properties: {
    suggestions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          original: { type: 'string', description: 'The original text that can be improved' },
          improved: { type: 'string', description: 'The improved version of the text' },
          reason: { type: 'string', description: 'Why the improvement is better' },
          type: { type: 'string', enum: ['verb', 'metric', 'length', 'keyword', 'clarity'] },
        },
        required: ['original', 'improved', 'reason', 'type'],
      },
    },
  },
  required: ['suggestions'],
};

/* ── Prompt builder ──────────────────────────── */

function buildImprovementPrompt(
  section: string,
  content: string,
  lang: 'es' | 'en',
  tone: 'quantitative' | 'concise' | 'executive',
  context?: string,
): string {
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

  const sectionGuidance: Record<string, string> = {
    summary: `Focus on:
- Professional impact and positioning
- Strong action verbs at the start
- Concise length (50-150 words)
- Keywords relevant to the professional field
- Clarity and readability`,
    experience: `Focus on:
- Strong action verbs at the start of each bullet
- Quantifiable metrics (%, $, amounts, team sizes)
- Optimal bullet length (10-35 words each)
- ATS-friendly keywords
- Results-oriented language (what was achieved, not just duties)
- Each bullet should be a separate line starting with -`,
    education: `Focus on:
- Relevant coursework or achievements
- Certifications and specializations
- Academic honors or distinctions`,
    skills: `Focus on:
- Suggest relevant technical keywords that are commonly searched by ATS
- Recommend skill grouping improvements
- Flag outdated technologies`,
    languages: `Focus on:
- Professional proficiency descriptions
- Standardized level formats`,
  };

  return `You are an expert CV/Resume optimization consultant specializing in ATS (Applicant Tracking Systems).

Analyze the following "${section}" section content in ${langLabel} and suggest concrete improvements.

${context ? `Additional context: ${context}` : ''}

${toneGuidance[tone]}

SECTION-SPECIFIC GUIDANCE:
${sectionGuidance[section] || ''}

CURRENT CONTENT:
"""
${content}
"""

CRITICAL RULES:
- NEVER invent experience, skills, certifications, or achievements the user does not have.
- Only suggest rephrasing, emphasizing, or restructuring existing content.
- Preserve all numbers, dates, company names, and proper nouns exactly as they appear.
- Each suggestion must replace a specific piece of the original text (the "original" field must match text from the content above verbatim).
- Return ONLY the JSON object, no additional text.
- Respond all text in ${langLabel}.

For each improvement, return:
- original: the exact text from the content that should be improved
- improved: the improved version
- reason: brief explanation in ${langLabel} of why it's better
- type: one of "verb" (action verb improvement), "metric" (adding quantification), "length" (length optimization), "keyword" (ATS keyword), "clarity" (readability/clarity)

Return a maximum of 5 suggestions, prioritized by impact.
Format: { "suggestions": [...] }`;
}

/* ── POST handler ────────────────────────────── */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = improveRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { section, content, lang, context, apiKey, model, tone } = parsed.data;

    const prompt = buildImprovementPrompt(section, content, lang, tone, context);

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
    const validated = improveResponseSchema.parse(aiResult);

    return NextResponse.json(validated);
  } catch (error) {
    console.error('AI improvement error:', error);
    const message = error instanceof Error ? error.message : 'Failed to analyze content';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
