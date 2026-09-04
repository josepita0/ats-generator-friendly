import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

const testConnectionSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = testConnectionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { apiKey } = parsed.data;

    const client = new GoogleGenAI({ apiKey });

    // Minimal generation call to verify the API key works
    const interaction = await client.interactions.create({
      model: 'gemini-3.6-flash',
      input: 'Reply with exactly: OK',
    });

    const rawText = interaction.output_text;
    if (!rawText) {
      return NextResponse.json(
        { error: 'No response from API' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, message: 'Connection successful' });
  } catch (error) {
    console.error('Test connection error:', error);

    const message = error instanceof Error ? error.message : 'Unknown error';
    const lowerMessage = message.toLowerCase();

    // Detect authentication errors (invalid API key)
    if (
      lowerMessage.includes('api key not valid') ||
      lowerMessage.includes('invalid api key') ||
      lowerMessage.includes('permission denied') ||
      lowerMessage.includes('unauthorized') ||
      lowerMessage.includes('401') ||
      lowerMessage.includes('api_key') ||
      lowerMessage.includes('apikey')
    ) {
      return NextResponse.json(
        { error: 'API key is not valid. Please check your key in Settings.' },
        { status: 401 },
      );
    }

    // Detect model not found errors
    if (
      lowerMessage.includes('model') ||
      lowerMessage.includes('not found') ||
      lowerMessage.includes('404')
    ) {
      console.error('Model error details:', message);
      return NextResponse.json(
        { error: 'Model not available. Please try a different model.' },
        { status: 400 },
      );
    }

    // Return more detailed error for debugging
    return NextResponse.json(
      { error: `Connection failed: ${message}` },
      { status: 500 },
    );
  }
}
