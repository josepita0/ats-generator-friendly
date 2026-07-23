import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { cvDataSchema } from '@/lib/cv/schemas';

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
    const { text } = await request.json();

    const client = new GoogleGenAI({});

    const interaction = await client.interactions.create({
      model: 'gemini-3.6-flash',
      input: `Parse this CV text into a structured JSON object. Extract all information present.

Rules:
- Dates in MM/YYYY format
- Most recent first
- Empty string "" if not available
- Generate unique IDs with crypto.randomUUID() format
- Keep descriptions concise but complete

CV TEXT:
${text}`,
      response_format: jsonResponseSchema as any,
    });

    const rawText = interaction.output_text;
    if (!rawText) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    const parsed = JSON.parse(rawText);
    const validated = cvDataSchema.parse(parsed);

    return NextResponse.json(validated);
  } catch (error) {
    console.error('Error parsing PDF:', error);
    const message = error instanceof Error ? error.message : 'Failed to parse PDF content';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
