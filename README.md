# ATS-Friendly CV Generator

[![License: MIT](https://img.shields.io/github/license/josepita0/ats-generator-friendly)](LICENSE)
[![CI](https://github.com/josepita0/ats-generator-friendly/actions/workflows/ci.yml/badge.svg)](https://github.com/josepita0/ats-generator-friendly/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)

Personal tool to build a resume optimized for Applicant Tracking Systems (ATS), exportable to PDF in **Spanish and English**. All data stays in your browser.

![Screenshot](docs/screenshot.png)

## Features

- **ATS-Compliant PDF** — Single-column, selectable text, no images or tables
- **Bilingual ES/EN** — Create and export CVs in both languages
- **AI Assistance** — Improve writing, translate content, extract text from existing PDFs
- **Job Description Matching** — Analyze a job posting against your resume and surface relevant keywords
- **Cover Letter Generation** — Generate tailored cover letters from your resume data
- **PDF Import** — Extract structured data from existing PDF resumes
- **ATS Diagnostic Preview** — Check your resume against ATS compliance rules before exporting
- **Local Storage** — Your data stays in your browser, no server persistence

## Quick Start

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

## AI Features

AI features (PDF import, writing improvement, translation, job matching) require a **Google Gemini API key**.

1. Copy the example environment file:

```bash
cp .env.local.example .env.local
```

2. Add your Gemini API key:

```
GOOGLE_API_KEY=your-key-here
```

Get your API key at: https://aistudio.google.com/app/apikey

Without an API key, all core features (manual entry, PDF generation, preview) work normally.

## Project Structure

```
app/
├── api/ai/              # API routes (Gemini, job-matcher, extract-text)
├── cv/                  # Legacy CV form page
├── editor/              # Main editor workspace
├── job-matcher/         # Job description matching
├── preview/             # ATS diagnostic preview
├── settings/            # API key and model configuration
├── layout.tsx           # Root layout
├── page.tsx             # Landing page
├── robots.ts            # SEO robots
└── sitemap.ts           # SEO sitemap

components/
├── cv-form/             # Form sections
├── cv-preview/          # On-screen preview
├── editor/              # Editor UI (workspace, sidebar, header, ATS feedback)
├── job-matcher/         # Job matching UI
├── navigation/          # App navigation
├── pdf/                 # @react-pdf/renderer documents
├── preview/             # ATS diagnostic panels
├── settings/            # Settings UI
└── ui/                  # Shared UI components

hooks/                   # Custom React hooks
lib/
├── ai/                  # Gemini API helpers
├── cv/                  # Schemas, scoring, normalization
├── i18n/                # ES/EN dictionaries
├── pdf/                 # PDF generation
└── storage.ts           # localStorage utilities

stores/                  # Zustand stores
types/                   # TypeScript type definitions
__tests__/               # Vitest tests
docs/                    # Documentation
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS 4 |
| State | Zustand + localStorage |
| Validation | react-hook-form + Zod |
| PDF | @react-pdf/renderer (client-side) |
| AI | Google Gemini API (optional) |
| Testing | Vitest + Testing Library |
| Hosting | Vercel |

## ATS Compliance

Every exported PDF follows these rules:

- **Single column** layout — no multi-column sections
- **No images, icons, or charts** — text only
- **Standard fonts** (Helvetica/Arial) for maximum parser compatibility
- **Consistent date format** — `MM/YYYY` throughout
- **Selectable, copyable text** — never rasterized
- **Linear reading order** — top-to-bottom, no complex layouts

If aesthetics conflict with ATS compliance, ATS compliance wins.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, conventions, and PR guidelines.

## Security

To report security vulnerabilities, see [SECURITY.md](SECURITY.md). Do not open public issues for security-related problems.

## License

[MIT](LICENSE)
