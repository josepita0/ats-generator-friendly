<!-- BEGIN:nextjs-agent-rules -->
# AGENTS.md — ATS-Friendly Resume Generator

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.


## Purpose

Instructions for AI coding agents (Claude Code, Cursor, ChatGPT, etc.) working in this repository.

Read this file completely before generating, modifying, or deleting code.

---

## Project

Personal-use application to build an ATS-friendly resume in **Spanish and English**, preview it in the browser, improve content with AI, and export it as a **client-side PDF**.

### Product constraints

This is **not** a commercial SaaS product.

* No authentication
* No database
* No server-side persistence
* No multi-user support
* No roles or permissions
* All state lives in the browser (React state + optional localStorage)

**Core principle:** prioritize simplicity over scalability.

If a proposed implementation introduces SaaS-style complexity (auth, DB, queues, workers, etc.), stop and justify it before implementing.

---

## Tech stack (source of truth)

Only use the technologies listed below unless the user explicitly approves a change.

| Layer       | Technology                        |
| ----------- | --------------------------------- |
| Framework   | Next.js (App Router) + TypeScript |
| Styling     | Tailwind CSS                      |
| State       | useState / useReducer             |
| Validation  | react-hook-form + zod             |
| PDF         | @react-pdf/renderer               |
| AI          | Claude API via Next.js API Routes |
| Hosting     | Vercel (free tier)                |
| Persistence | localStorage (optional)           |

### Hard rules

* PDF generation must be **100% client-side** using `@react-pdf/renderer`.
* Do not use Puppeteer, Playwright, WeasyPrint, or any HTML→PDF headless browser solution.
* Claude API keys must never be exposed to the client.
* All AI requests must go through `/app/api/*`.
* Do not add a separate backend, database, auth provider, or external storage service.

---

## Repository architecture

Expected structure:

```text
/app
  /api
    /ai
      route.ts
  /cv
    page.tsx
  layout.tsx
  page.tsx

/components
  /cv-form
  /cv-preview
  /pdf
  /chat

/lib
  /ai
  /cv
  /i18n

/types
  cv.ts
```

### Separation of concerns

* **Form** = user input
* **Preview** = browser rendering
* **PDF** = react-pdf document
* **AI** = prompts, parsing, validation
* **Types** = shared data model

Do not share JSX between form, preview, and PDF layers.

---

## Single source of truth

The resume structure is defined exclusively in:

```text
/types/cv.ts
```

A central `CVData` type must drive:

* Form state
* On-screen preview
* PDF document
* AI payloads

### Language model

Free-text fields must support:

* `es`
* `en`

Examples:

* Summary
* Experience descriptions
* Achievements

Structural fields are **not translated**:

* Name
* Company
* Dates
* Locations

When adding a field:

1. Update `CVData`
2. Update zod schema
3. Update form
4. Update preview
5. Update PDF
6. Update AI payloads if needed

---

## ATS compliance rules (non-negotiable)

Every PDF must satisfy these requirements:

### Layout

* Single column only
* Linear top-to-bottom reading order
* No tables for main content
* No multi-column sections

### Visuals

* No images
* No icons conveying information
* No charts or skill bars
* No decorative graphics

### Typography

* Use standard fonts (Helvetica, Arial, Times)
* Use consistent section headings
* Use a consistent date format (`MM/YYYY`)

### Text extraction

The PDF must remain:

* Selectable
* Copyable
* Machine-readable

Never rasterize text.

If aesthetics conflict with ATS compliance, choose ATS compliance.

---

## AI integration rules

### API location

All Claude calls must live under:

```text
/app/api/ai/*
```

### Security

* API keys stay server-side only.
* Never call Claude directly from a client component.

### Structured outputs

Every AI response must:

1. Request JSON
2. Validate with zod
3. Reject invalid output

Do not auto-fill the resume with unvalidated free text.

### Allowed AI use cases

#### 1. Writing improvement

Improve existing bullets by suggesting:

* Stronger action verbs
* Quantification
* Conciseness
* Clarity

#### 2. ES ↔ EN professional adaptation

Translate with professional context, not literal word-for-word translation.

#### 3. Job-posting adaptation

Given a job description and `CVData`, suggest:

* Relevant experiences to emphasize
* Relevant skills to surface
* Keywords to incorporate

### Critical rule

The AI must **never invent experience, skills, certifications, or achievements** that are not present in the user's data.

### User approval

AI suggestions are **advisory**.

The user must be able to review, edit, accept, or reject every suggestion before it modifies the resume.

---

## Code standards

### TypeScript

* `strict: true`
* Avoid `any`
* If `any` is unavoidable, add a justification comment.

### Components

* Keep components small and focused.
* Split components that grow beyond ~150 lines.

### Naming

* Components: `PascalCase`
* Hooks: `useCamelCase`
* Types/interfaces: `PascalCase`
* Utility functions: `camelCase`

### Business logic

Keep business logic out of UI components.

Place it in:

* `/lib/cv`
* `/lib/ai`
* `/lib/i18n`

### Comments

Comment:

* ATS-specific decisions
* Non-obvious tradeoffs
* Security-related constraints

Do not comment obvious JSX or simple assignments.

### Dependencies

Before adding a package, verify that React, Next.js, Tailwind, or existing utilities cannot solve the problem.

### Accessibility

Provide:

* Proper labels
* Keyboard navigation
* Logical tab order
* Accessible form controls

---

## Preferred workflow

When implementing a feature:

1. Read the existing implementation.
2. Update `CVData` if the data model changes.
3. Add or update zod validation.
4. Implement the minimal UI change.
5. Update preview and PDF renderers.
6. Add tests if the project includes them.
7. Explain assumptions and tradeoffs.

Prefer extending existing modules over creating new abstractions.

---

## Never do these things

* Implement authentication
* Add user sessions
* Create database models or ORMs
* Add Supabase/Firebase/S3 storage
* Introduce Redux, Zustand, or other global state libraries without explicit approval
* Generate PDFs server-side
* Expose Claude credentials in client code
* Over-engineer simple state flows

---

## Common commands

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

### Type check

```bash
npm run type-check
```

### Build

```bash
npm run build
```

---

## Completion checklist

Before marking a feature as complete, verify:

* [ ] The PDF is still single-column and ATS-friendly.
* [ ] PDF text remains selectable and copyable.
* [ ] `CVData` is still the single source of truth.
* [ ] No Claude API key is exposed to the client.
* [ ] No unapproved dependency or external service was added.
* [ ] Spanish and English content are handled correctly.
* [ ] Structural fields are not incorrectly translated.
* [ ] AI suggestions require user approval before applying.

---

## Decision priorities

When multiple implementations are possible, choose in this order:

1. ATS compliance
2. Security of AI credentials
3. Simplicity
4. Consistency with existing code
5. Readability
6. Performance optimization only when necessary

This document is the authoritative guide for AI agents working on this repository.


<!-- END:nextjs-agent-rules -->
