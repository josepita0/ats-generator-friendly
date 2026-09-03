import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { cvDataSchema } from '@/lib/cv/schemas';

const parsePdfRequestSchema = z.object({
  text: z.string().min(1, 'CV text is required'),
});

const jsonResponseSchema = {
  type: 'object',
  properties: {
    personalInfo: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        location: { type: 'string' },
        linkedin: { type: 'string' },
        website: { type: 'string' },
      },
      required: ['name', 'email', 'phone', 'location'],
    },
    summary: {
      type: 'object',
      properties: { es: { type: 'string' }, en: { type: 'string' } },
      required: ['es', 'en'],
    },
    experience: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          company: { type: 'string' },
          position: {
            type: 'object',
            properties: { es: { type: 'string' }, en: { type: 'string' } },
            required: ['es', 'en'],
          },
          location: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          current: { type: 'boolean' },
          descriptions: {
            type: 'object',
            properties: { es: { type: 'string' }, en: { type: 'string' } },
            required: ['es', 'en'],
          },
        },
        required: ['id', 'company', 'position', 'current', 'descriptions'],
      },
    },
    education: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          institution: { type: 'string' },
          degree: {
            type: 'object',
            properties: { es: { type: 'string' }, en: { type: 'string' } },
            required: ['es', 'en'],
          },
          field: {
            type: 'object',
            properties: { es: { type: 'string' }, en: { type: 'string' } },
            required: ['es', 'en'],
          },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
        },
        required: ['id', 'institution', 'degree', 'field'],
      },
    },
    skills: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          category: { type: 'string' },
          skills: { type: 'array', items: { type: 'string' } },
        },
        required: ['id', 'category', 'skills'],
      },
    },
    languages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          language: { type: 'string' },
          level: { type: 'string' },
        },
        required: ['id', 'language', 'level'],
      },
    },
    language: { type: 'string', enum: ['es', 'en'] },
  },
  required: ['personalInfo', 'summary', 'experience', 'education', 'skills', 'languages', 'language'],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = parsePdfRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { text } = parsed.data;

    const client = new GoogleGenAI({});

    const interaction = await client.interactions.create({
      model: 'gemini-3.6-flash',
      input: `You are a CV text parser. Your task is to EXTRACT information only — do NOT translate.

DETECT LANGUAGE FIRST:
- Read the CV text and determine if it's in Spanish or English.
- Set "language" to "es" for Spanish or "en" for English.

EXTRACT ALL SECTIONS COMPLETELY (do not skip any):

1. personalInfo — name, email, phone, location, linkedin, website
2. summary — write the professional summary exactly as it appears
3. experience — extract EVERY work experience entry (not just the first). Each entry must have company, position, location, dates, and descriptions.
4. education — extract EVERY education entry. Each must have institution, degree, field, and dates.
5. skills — extract EVERY skill category with ALL skills listed.
6. languages — extract EVERY language with its proficiency level.

BILLINGUAL TEXT FIELDS (summary, position, descriptions, degree, field):
- Only fill the detected language field (es OR en) with the extracted text
- Leave the other language field as empty string ""
- DO NOT translate. DO NOT copy content to both languages.

FORMATTING:
- Dates in MM/YYYY format
- Most recent experience/education first
- Empty string "" if information is not available
- Generate unique IDs with crypto.randomUUID() format
- Keep descriptions concise but complete — preserve all achievements and details

CV TEXT:
${text}`,
      response_format: jsonResponseSchema as any,
    });

    const rawText = interaction.output_text;
    if (!rawText) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    const aiResult = JSON.parse(rawText);
    const validated = cvDataSchema.parse(aiResult);

    return NextResponse.json(validated);
  } catch (error) {
    console.error('Error parsing PDF:', error);
    const message = error instanceof Error ? error.message : 'Failed to parse PDF content';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
