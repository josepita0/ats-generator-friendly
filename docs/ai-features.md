# AI Features

The CV generator includes AI-powered features to help you improve your resume. These features are **optional** and require a Gemini API key.

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

### 3. CV Translation (ES ↔ EN)

Professional translation of summary, experience, and education content between Spanish and English.

**Endpoint:** `POST /api/ai/translate`

### 4. AI Chat — Job-Posting Adaptation

Chat with an AI assistant to adapt your CV to a specific job posting. Suggestions are advisory — you review and approve every change before it's applied.

**Endpoint:** `POST /api/ai/chat`

### 5. Cover Letter Generator

Generate a formal, natural-sounding cover letter from your CV data and the job description. The letter is editable and can be downloaded as an ATS-friendly PDF.

**Endpoint:** `POST /api/ai/cover-letter`

Features:
- Paste a job description and ask the AI to adapt your CV
- Get concrete, field-level suggestions with rationale
- Review and apply/dismiss each suggestion individually
- Conversational advice on how to improve your resume

## Setup

### 1. Get a Gemini API Key

1. Go to https://aistudio.google.com/apikey
2. Create a new API key
3. Copy the key

### 2. Configure the Environment

Create a `.env.local` file in the project root:

```bash
GOOGLE_API_KEY=your-key-here
```

### 3. Restart the Development Server

```bash
npm run dev
```

## Cost

Using Gemini API with `gemini-3.6-flash` is free tier friendly. Estimated tokens per request:

| Feature | Model | Tokens (approx.) |
|---------|-------|------------------|
| PDF Import | gemini-3.6-flash | ~3,000-5,000 |
| Writing Improvement | gemini-3.6-flash | ~200-500 |
| CV Translation | gemini-3.6-flash | ~2,000-4,000 |
| AI Chat | gemini-3.6-flash | ~3,000-6,000 |
| Cover Letter | gemini-3.6-flash | ~2,000-4,000 |

For personal use, costs should be minimal.

## Without AI

All core features work without AI:
- Manual CV entry
- PDF generation
- Preview functionality

AI is only needed for:
- Automatic PDF import
- Writing improvement suggestions
- CV translation
- Job-posting adaptation chat

## Troubleshooting

### "AI not configured" error

Make sure:
1. `.env.local` file exists
2. `GOOGLE_API_KEY` is set correctly
3. The key is valid and has available quota

### API errors

Check your Google AI Studio dashboard for:
- API key validity
- Available quota
- Usage limits
