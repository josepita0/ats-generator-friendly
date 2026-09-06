import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

const extractTextRequestSchema = z.object({
  pdfBase64: z.string().min(1, 'PDF base64 data is required'),
  apiKey: z.string().min(1, 'API key is required'),
  model: z.enum(['flash', 'pro']),
});

function resolveModelName(model: 'flash' | 'pro'): string {
  return model === 'pro' ? 'gemini-2.5-pro' : 'gemini-3.6-flash';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = extractTextRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { pdfBase64, apiKey, model } = parsed.data;

    const client = new GoogleGenAI({ apiKey });

    // Use DocumentContent type for PDF input via Interactions API
    const interaction = await client.interactions.create({
      model: resolveModelName(model),
      input: {
        type: 'document',
        data: pdfBase64,
        mime_type: 'application/pdf',
      },
      system_instruction:
        'Extract ALL text content from the provided PDF document. Return the raw text exactly as it appears, preserving the original structure, line breaks, and formatting. Do NOT summarize, translate, or modify the content. If the PDF contains a job description, return the full job posting text.',
    });

    const extractedText = interaction.output_text;
    if (!extractedText) {
      return NextResponse.json(
        { error: 'No text could be extracted from the PDF' },
        { status: 500 },
      );
    }

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to extract text from PDF';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
