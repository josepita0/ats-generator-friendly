# AI Features

The CV generator includes AI-powered features to help you improve your resume. These features are **optional** and require an OpenAI API key.

## Available Features

### 1. PDF Import with AI Parsing

Automatically extract and structure data from an existing PDF CV.

**Endpoint:** `POST /api/ai/parse-pdf`

### 2. Writing Improvement

Get suggestions to improve bullet points and descriptions with:
- Stronger action verbs
- Quantification where possible
- More concise and professional language

**Endpoint:** `POST /api/ai/improve`

## Setup

### 1. Get an OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with `sk-`)

### 2. Configure the Environment

Create a `.env.local` file in the project root:

```bash
OPENAI_API_KEY=sk-your-key-here
```

### 3. Restart the Development Server

```bash
npm run dev
```

## Cost

Using OpenAI API is paid per token. Estimated costs:

| Feature | Model | Tokens (approx.) |
|---------|-------|------------------|
| PDF Import | gpt-4o-mini | ~2,000-5,000 |
| Writing Improvement | gpt-4o-mini | ~200-500 |

For personal use, costs should be minimal (less than $0.01 per CV).

## Without AI

All core features work without AI:
- Manual CV entry
- PDF generation
- Preview functionality

AI is only needed for:
- Automatic PDF import
- Writing improvement suggestions

## Troubleshooting

### "AI not configured" error

Make sure:
1. `.env.local` file exists
2. `OPENAI_API_KEY` is set correctly
3. The key is valid and has available credits

### API errors

Check your OpenAI dashboard for:
- API key validity
- Available credits
- Usage limits
