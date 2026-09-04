# Changelog — Avora

## [Unreleased]

### Added
- `/api/ai/cover-letter` — AI-generated cover letter (formal, natural, human tone) from CV data + job description
- `CoverLetterSection` component — inline card with generate/regenerate, editable textarea, live on-screen preview, PDF download, and copy-to-clipboard
- `CoverLetterPreview` component — HTML on-screen preview (header from personalInfo, date, body)
- `CoverLetterDocument` — client-side react-pdf component for ATS-friendly cover letter PDF (single column, standard font, selectable text)
- `types/coverLetter.ts` — `CoverLetterData` type (body as BilingualText, stored separately from CVData)
- `lib/ai/coverLetter.ts` — prompt builder with formal/natural/human tone rules and Gemini response_format
- `coverLetter.*` i18n keys to both ES/EN dictionaries
- Job description state lifted to `/cv` page — shared between ChatSection and CoverLetterSection
- `/api/ai/chat` — AI chat endpoint for job-posting CV adaptation with structured suggestions
- `ChatSection` component — inline chat panel with job description input, message history, and suggestion review/apply
- `SuggestionCard` component — shows field-level edits (current vs proposed) with Apply/Dismiss buttons
- `lib/cv/suggestions.ts` — pure `applySuggestion` and `suggestionLabel` business logic
- `lib/ai/chat.ts` — prompt builder, Gemini response_format schema, and anti-hallucination suggestion sanitizer
- `types/chat.ts` — `ChatMessage`, `Suggestion`, `SuggestionTarget` types
- `chat.*` i18n keys to both ES/EN dictionaries
- `/api/ai/translate` — new Gemini endpoint for professional CV translation (ES↔EN)
- `TranslateButton` component — direction selector + translate button with loading/error states
- `translate.*` i18n keys to both ES/EN dictionaries
- `MonthYearPicker` component — custom month/year select dropdowns replacing native `<input type="month">` (handles `MM/YYYY` and `YYYY-MM` formats)
- `lib/cv/descriptions.ts` — `parseBullets` helper to detect bullet-prefixed lines and render as lists in PDF and preview
- `replaceBulletInDescriptions` — normalizes Unicode bullet chars to `-` when data enters from AI API

### Changed
- PDF parsing prompt: extract only (no translation), detect language, fill only detected language, explicit instructions for ALL sections (experience, education, skills, languages)
- `TranslateButton` uses `getCvData` callback for live form data instead of static snapshot
- Removed unused `openai` dependency
- `useForm` uses `values` prop instead of `defaultValues` — form re-initializes when stored data loads from localStorage
- PDF and preview date format: `"Nov. 2022"` instead of `"undefined/11/2022"` — detects `MM/YYYY` and `YYYY-MM`, uses Spanish/English month names
- PDF and preview render bulleted descriptions as proper lists (with detected bullet character) instead of flat paragraphs

### Fixed
- PDF import was missing education, skills, and languages — AI was overloaded with parse+translate, now only extracts
- Bilingual fields were filled in both languages during import — now only the detected language is populated until user translates
- `startDate`/`endDate` inputs showed empty on page load despite valid stored data — form now receives stored values via `values` prop + `reset` pattern
- Single date entry (only `startDate` or `endDate`) now defaults to `endDate` position on load
- Bullet characters from AI responses (`●`, `▪`, `▸`, etc.) normalized to `-` before storage and rendered correctly as list items
- SVG `clip-rule` and `fill-rule` fixed in landing page header

---

## [1.0.0] — 2026-07-23

### Added
- Scaffolding Next.js 16 App Router + TypeScript + Tailwind 4
- react-hook-form + zod + @react-pdf/renderer instalados
- Folder structure por AGENTS.md (components/cv-form, /cv-preview, /pdf, /chat, lib/ai, /cv, /i18n, types/)
- CVData type central (types/cv.ts) con campos bilingüe ES/EN
- Zod schemas en lib/cv/schemas.ts
- localStorage auto-save
- Formulario completo (PersonalInfo, Summary, Experience, Education, Skills, Languages)
- PDF import via pdfjs-dist + texto truncado a 5000 chars
- API route parse-pdf para extraer datos del PDF por AI
- API route improve para mejorar redacción
- On-screen preview modal
- PDF download con @react-pdf/renderer (single-column, ATS-compliant)
- Landing page bilingüe
- i18n dictionaries

### Changed
- AI provider: OpenAI → OpenCode SDK → Google Gemini SDK (@google/generative-ai) → Google GenAI Interactions API (@google/genai)
- Modelo: gpt-4o-mini → gemini-2.0-flash → gemini-3.6-flash
- Env var: OPENAI_API_KEY → GEMINI_API_KEY → GOOGLE_API_KEY
- response_format: type 'json' con json_schema anidado → schema JSON Schema directo (Interactions API)

### Fixed
- useFieldArray fuera de FormProvider → envuelto con FormProvider
- pdfjs-dist DOMMatrix SSR error → dynamic import + worker local
- Error handling opaco → mensajes de error real desde API
- Zod validation rejecting empty strings → campos opcionales (location, startDate, endDate)
- PdfImporter enviaba string hardcodeado en lugar del texto extraído del PDF

### Design
- Dark theme: bg #0c0c21, accent pink/teal/yellow
- Retro cards: colored staggered sections con collapse toggle
- Slide-out preview panel (FAB flotante)
- Tipografía: Sora, Inter, Space Grotesk
- Fondo pattern: dots grid
