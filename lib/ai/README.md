# AI Utilities

Prompts, Gemini API helpers, and response parsing logic.
All AI calls go through /app/api/ai/* routes — never from the client.

- `client.ts` — checks if Gemini/API key is configured
- `chat.ts` — prompt builder, structured output schema, anti-hallucination sanitizer for the chat endpoint
