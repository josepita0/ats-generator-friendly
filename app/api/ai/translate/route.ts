import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import type { CVData } from '@/types/cv';
import { cvDataSchema } from '@/lib/cv/schemas';

const translationResponseSchema = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    experience: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          position: { type: 'string' },
          descriptions: { type: 'string' },
        },
        required: ['id', 'position', 'descriptions'],
      },
    },
    education: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          degree: { type: 'string' },
          field: { type: 'string' },
        },
        required: ['id', 'degree', 'field'],
      },
    },
  },
  required: ['summary', 'experience', 'education'],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cvData = body.cvData as CVData;
    const sourceLang = body.sourceLang as 'es' | 'en';
    const targetLang = body.targetLang as 'es' | 'en';

    if (!cvData || !sourceLang || !targetLang) {
      return NextResponse.json(
        { error: 'Missing required fields: cvData, sourceLang, targetLang' },
        { status: 400 }
      );
    }

    if (!['es', 'en'].includes(sourceLang) || !['es', 'en'].includes(targetLang)) {
      return NextResponse.json(
        { error: 'sourceLang and targetLang must be "es" or "en"' },
        { status: 400 }
      );
    }

    if (sourceLang === targetLang) {
      return NextResponse.json(
        { error: 'sourceLang and targetLang must be different' },
        { status: 400 }
      );
    }

    const summarySource = cvData.summary[sourceLang] || '';
    const experienceItems = (cvData.experience || [])
      .filter((e: CVData['experience'][number]) => e.position[sourceLang] || e.descriptions[sourceLang])
      .map((e: CVData['experience'][number]) => ({
        id: e.id,
        position: e.position[sourceLang] || '',
        descriptions: e.descriptions[sourceLang] || '',
      }));
    const educationItems = (cvData.education || [])
      .filter((e: CVData['education'][number]) => e.degree[sourceLang] || e.field[sourceLang])
      .map((e: CVData['education'][number]) => ({
        id: e.id,
        degree: e.degree[sourceLang] || '',
        field: e.field[sourceLang] || '',
      }));

    const sourceName = sourceLang === 'es' ? 'Spanish' : 'English';
    const targetName = targetLang === 'es' ? 'Spanish' : 'English';

    const prompt = `You are a professional CV translator. Translate the following resume content from ${sourceName} to ${targetName}.

RULES:
- Maintain professional resume tone
- Adapt idioms and expressions naturally — do NOT translate literally
- Keep the same meaning and level of detail
- Preserve all numbers, dates, and proper nouns (company names, institutions, etc.)
- Return ONLY the translations in the specified JSON format
- If a section says "(no content)", return an empty string for it

SUMMARY:
${summarySource || '(no content)'}

EXPERIENCE:
${experienceItems.map((e) => `ID: ${e.id}\nPosition: ${e.position || '(no content)'}\nDescription: ${e.descriptions || '(no content)'}`).join('\n---\n')}

EDUCATION:
${educationItems.map((e) => `ID: ${e.id}\nDegree: ${e.degree || '(no content)'}\nField: ${e.field || '(no content)'}`).join('\n---\n')}`;

    const client = new GoogleGenAI({});

    const interaction = await client.interactions.create({
      model: 'gemini-3.6-flash',
      input: prompt,
      response_format: translationResponseSchema as any,
    });

    const rawText = interaction.output_text;
    if (!rawText) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    const translations = JSON.parse(rawText);

    const updatedData: CVData = JSON.parse(JSON.stringify(cvData));

    if (translations.summary) {
      updatedData.summary[targetLang] = translations.summary;
    }

    for (const exp of translations.experience || []) {
      const target = updatedData.experience.find((e) => e.id === exp.id);
      if (target) {
        if (exp.position) target.position[targetLang] = exp.position;
        if (exp.descriptions) target.descriptions[targetLang] = exp.descriptions;
      }
    }

    for (const edu of translations.education || []) {
      const target = updatedData.education.find((e) => e.id === edu.id);
      if (target) {
        if (edu.degree) target.degree[targetLang] = edu.degree;
        if (edu.field) target.field[targetLang] = edu.field;
      }
    }

    const validated = cvDataSchema.parse(updatedData);

    return NextResponse.json(validated);
  } catch (error) {
    console.error('Error translating:', error);
    const message = error instanceof Error ? error.message : 'Failed to translate';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
