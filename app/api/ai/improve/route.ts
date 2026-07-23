import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

const improveSchema = z.object({
  text: z.string(),
  language: z.enum(['es', 'en']),
  context: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, language, context } = improveSchema.parse(body);

    const client = new GoogleGenAI({});

    const systemPrompt = `You are a professional CV writer. Improve the provided text for an ATS-friendly resume.
Return ONLY a JSON object with a single field "improved" containing the improved text.
Use stronger action verbs, add quantification where possible, and make it more concise.`;

    const userPrompt = context
      ? `Context: ${context}\n\nText to improve:\n${text}`
      : `Text to improve:\n${text}`;

    const interaction = await client.interactions.create({
      model: 'gemini-3.6-flash',
      input: `${systemPrompt}\n\n${userPrompt}`,
      response_format: {
        type: 'object',
        properties: { improved: { type: 'string' } },
        required: ['improved'],
      } as any,
    });

    const rawText = interaction.output_text;
    if (!rawText) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    const parsed = JSON.parse(rawText);
    return NextResponse.json({ improved: parsed.improved || text });
  } catch (error) {
    console.error('Error improving text:', error);
    const message = error instanceof Error ? error.message : 'Failed to improve text';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
