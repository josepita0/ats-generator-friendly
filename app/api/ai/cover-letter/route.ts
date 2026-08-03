import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { cvDataSchema } from '@/lib/cv/schemas';
import { buildCoverLetterPrompt, coverLetterResponseSchema, geminiResponseFormat } from '@/lib/ai/coverLetter';

const coverLetterRequestSchema = z.object({
  cvData: z.unknown(),
  jobDescription: z.string().max(8000).optional(),
  language: z.enum(['es', 'en']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = coverLetterRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { cvData: rawCv, jobDescription, language } = parsed.data;

    const cvResult = cvDataSchema.safeParse(rawCv);
    if (!cvResult.success) {
      return NextResponse.json(
        { error: 'Invalid CV data', details: cvResult.error.flatten() },
        { status: 400 }
      );
    }

    const cvData = cvResult.data;

    const prompt = buildCoverLetterPrompt({
      cvData,
      jobDescription,
      language,
    });

    const client = new GoogleGenAI({});

    const interaction = await client.interactions.create({
      model: 'gemini-3.6-flash',
      input: prompt,
      response_format: geminiResponseFormat as any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Gemini SDK expects raw JSON schema type incompatible with TS
    });

    const rawText = interaction.output_text;
    if (!rawText) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    const aiResponse = JSON.parse(rawText);
    const validated = coverLetterResponseSchema.parse(aiResponse);

    return NextResponse.json({ letter: validated.letter });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate cover letter';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
