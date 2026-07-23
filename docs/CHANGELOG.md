# Changelog — RetroResume

## [Unreleased]

### Added
-

### Changed
-

### Fixed
-

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
