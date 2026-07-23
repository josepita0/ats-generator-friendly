# RetroResume — Session Quickstart

## Stack
Next.js 16 App Router + TypeScript + Tailwind 4 | react-hook-form + zod | @react-pdf/renderer | @google/genai (Gemini)

## Sacred Rules
- No auth, no DB, no server persistence — localStorage only
- PDF 100% cliente (react-pdf), single-column, texto seleccionable
- `CVData` en `types/cv.ts` es la única fuente de verdad
- Form ≠ Preview ≠ PDF — NO comparten JSX
- AI suggestions requieren aprobación del usuario antes de aplicar

## Arquitectura
```
CVData → Form (input) → Preview (HTML) → PDF (react-pdf)
         ↘ AI payload (Gemini structured output)
```

## AI (Gemini)
- SDK: `@google/genai` (Interactions API, no el viejo `@google/generative-ai`)
- Modelo: `gemini-3.6-flash` (gemini-2.0-* y 1.5-* deprecated)
- Env: `GOOGLE_API_KEY` (también `GEMINI_API_KEY` como fallback)
- Structured output: `response_format` con JSON Schema directo, no `{ type: 'json', json_schema }`

## Diseño
- Tema oscuro: bg `#0c0c21`, accent pink `#ff2d78`, teal `#00ffcc`, yellow `#ffe04a`
- Tarjetas retro: `retro-card` (borde 3px black, box-shadow 6px, 1.5rem radius)
- Inputs: `retro-input` (white bg, 3px black border, 0.75rem radius)
- Tipografía: Sora (headlines), Inter (body), Space Grotesk (labels)

## Estructura de Carpetas
```
app/api/ai/*          → Gemini endpoints (parse-pdf, improve)
app/cv/page.tsx       → Formulario principal
components/cv-form/   → Secciones del formulario (PersonalInfo, Experience, etc.)
components/cv-preview/→ Preview on-screen + slide-out panel
components/pdf/       → Documento react-pdf (ATS-compliant)
lib/cv/               → Zod schemas + defaults
lib/i18n/             → Diccionarios ES/EN
types/cv.ts           → CVData interface
docs/                 → Documentación
```

## Flujo para nueva feature
1. Si cambia modelo de datos → `types/cv.ts` primero
2. Luego `lib/cv/schemas.ts` (zod)
3. Después form, preview, PDF en ese orden
4. Si toca AI → actualizar JSON schema en route + prompt
5. `npm run build` para verificar

## Convenciones
- Componentes: PascalCase
- Hooks: useCamelCase
- Utilidades: camelCase
- Sin `any` (comentario justificado si inevitable)
- Comentar solo decisiones no obvias
