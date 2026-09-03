# ATS-Friendly CV Generator

Personal tool to build a resume optimized for Applicant Tracking Systems (ATS), exportable to PDF in **Spanish and English**.

## Features

- 📄 **ATS-Compliant PDF** — Single-column, selectable text, no images or tables
- 🌐 **Bilingual ES/EN** — Create CVs in both languages
- 📱 **Local Storage** — Your data stays in your browser
- 🤖 **AI Assistance** (optional) — Import from PDF and improve writing

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### 3. Build for production

```bash
npm run build
npm start
```

## Optional: Enable AI Features

AI features (PDF import, translation, chat) require a Google Gemini API key.

1. Copy the example environment file:

```bash
cp .env.local.example .env.local
```

2. Add your Gemini API key:

```bash
GOOGLE_API_KEY=your-key-here
```

Get your API key at: https://aistudio.google.com/app/apikey

Without an API key, all core features (manual entry, PDF generation, preview) work normally.

## Project Structure

```
app/
├── api/ai/           # Gemini API routes
├── cv/page.tsx       # CV form page
├── page.tsx          # Landing page
└── layout.tsx         # Root layout

components/
├── cv-form/          # Form sections (PersonalInfo, Experience, etc.)
├── cv-preview/       # On-screen preview + modal
├── pdf/              # @react-pdf/renderer components
└── chat/             # AI writing assistant UI

lib/
├── ai/               # Gemini helpers
├── cv/               # Zod schemas, default values
├── i18n/             # ES/EN dictionaries
└── storage.ts        # localStorage utilities

types/
└── cv.ts             # Central CVData type

docs/
├── pdf-import.md     # PDF import documentation
└── ai-features.md    # AI features documentation
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS |
| State | useState / useReducer + localStorage |
| Validation | react-hook-form + Zod |
| PDF | @react-pdf/renderer |
| AI | Google Gemini API (optional) |

## ATS Compliance

The generated PDF follows these rules:
- Single column layout
- No images or icons
- No tables for main content
- Standard fonts (Helvetica/Arial)
- Selectable, copyable text
- Consistent MM/YYYY date format
