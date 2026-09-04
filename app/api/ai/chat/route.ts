import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { cvDataSchema } from '@/lib/cv/schemas';
import { buildChatPrompt, chatResponseSchema, geminiResponseFormat, sanitizeSuggestions } from '@/lib/ai/chat';

const chatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .max(20)
    .default([]),
  cvData: z.unknown(),
  jobDescription: z.string().max(8000).optional(),
  language: z.enum(['es', 'en']),
  apiKey: z.string().min(1, 'API key is required'),
  model: z.enum(['flash', 'pro']),
});

/** Map client model shorthand to Gemini model ID */
function resolveModelName(model: 'flash' | 'pro'): string {
  return model === 'pro' ? 'gemini-2.5-pro' : 'gemini-3.6-flash';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { message, history, cvData: rawCv, jobDescription, language, apiKey, model } = parsed.data;

    const cvResult = cvDataSchema.safeParse(rawCv);
    if (!cvResult.success) {
      return NextResponse.json(
        { error: 'Invalid CV data', details: cvResult.error.flatten() },
        { status: 400 }
      );
    }

    const cvData = cvResult.data;

    const prompt = buildChatPrompt({
      message,
      history,
      cvData,
      jobDescription,
      language,
    });

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

    const aiResponse = JSON.parse(rawText);
    const validated = chatResponseSchema.parse(aiResponse);

    const sanitized = sanitizeSuggestions(validated.suggestions, cvData);

    return NextResponse.json({
      reply: validated.reply,
      suggestions: sanitized,
    });
  } catch (error) {
    console.error('Error in chat:', error);
    const message = error instanceof Error ? error.message : 'Failed to process chat';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
