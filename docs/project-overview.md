# ATS-Friendly CV Generator

## Project Purpose

Personal-use web application to build a resume optimized for **Applicant Tracking Systems (ATS)**.

ATS software automatically parses and ranks resumes before a human sees them. Resumes with multi-column layouts, images, tables, or non-standard formatting are often rejected or garbled. This tool ensures every generated PDF passes automated scanning while looking professional.

The tool is **bilingual (Spanish/English)**, runs entirely in the browser, and requires no backend or database.

---

## All Features

### 1. Manual CV Form
- **Personal Info**: Name, email, phone, location, LinkedIn, website
- **Professional Summary**: Bilingual (ES/EN)
- **Work Experience**: Add/remove entries, company, position, dates, description
- **Education**: Institution, degree, field, dates
- **Skills**: Categorized skill groups
- **Languages**: Language name + proficiency level
- **Language Toggle**: Switch between ES/EN UI and CV content

### 2. Auto-Save (localStorage)
- Your data persists across browser sessions
- You never lose progress on reload

### 3. On-Screen Preview
- Modal window showing the rendered CV
- Matches the ATS-friendly layout

### 4. PDF Download
- 100% client-side PDF generation via `@react-pdf/renderer`
- Single-column, linear reading order
- Selectable and copyable text (never rasterized)
- Standard fonts (Helvetica)
- Consistent `MM/YYYY` date format
- A4 page size

### 5. PDF Import (AI-optional)
- Upload an existing CV PDF
- Text extraction via pdfjs-dist
- AI parses the text into structured CVData
- Form auto-fills with the result

### 6. AI Writing Improvement (AI-optional)
- Improve bullet points and descriptions
- Suggests stronger action verbs, quantification, conciseness

### 7. Bilingual Landing Page
- Spanish and English UI
- Feature showcase with call-to-action

---

## ATS Compliance Rules

Every generated PDF follows these non-negotiable rules:

| Rule | Implementation |
|---|---|
| Single column | `flexDirection: 'column'` in react-pdf |
| No tables | `View` + `Text` only, no `Table` components |
| No icons/images | Plain text for all information |
| Standard fonts | Helvetica (sans-serif) |
| Selectable text | Client-side react-pdf rendering |
| Linear reading order | Top-to-bottom layout |
| Consistent dates | `MM/YYYY` format |

---

## How It Works

```
User fills form → CVData stored in localStorage & in-memory
                    ↓
           Preview button → HTML preview modal
                    ↓
          Download button → @react-pdf/renderer → Blob → .pdf file
```

Optionally with AI:

```
User uploads PDF → pdfjs-dist extracts text → /api/ai/parse-pdf → CVData → form auto-fill
User clicks "Improve" → /api/ai/improve → suggestion → user approves → field updated
```

---

## Architecture

- **No database**: All state lives in the browser
- **No authentication**: Single-user personal tool
- **No server-side persistence**: localStorage only
- **No external services** (optional): OpenAI API key is user-provided

The resume data model (`CVData` in `types/cv.ts`) is the single source of truth used by:
- Form components (input)
- Preview component (display)
- PDF document (generation)
- AI payloads (when configured)

---

## Data Model

```typescript
interface CVData {
  personalInfo: PersonalInfo;   // name, email, phone, location
  summary: BilingualText;       // { es: string, en: string }
  experience: ExperienceEntry[]; // company, position, dates, descriptions
  education: EducationEntry[];    // institution, degree, field, dates
  skills: SkillCategory[];       // category + skills array
  languages: LanguageEntry[];    // name + level
  language: 'es' | 'en';         // display language
}
```

---

## UI Flow

1. **Landing page** (`/`) — Bilingual, explains features, links to CV builder
2. **CV builder** (`/cv`) — All form sections + preview + PDF download buttons
3. **Preview modal** — Renders form data as it will appear in PDF
4. **PDF download** — Generates and downloads ATS-compliant PDF

---

## Technical Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 App Router | Modern React + file-based routing |
| Language | TypeScript strict | Type safety without `any` |
| Styling | Tailwind CSS 4 | Utility-first, consistent design |
| Validation | react-hook-form + Zod | Declarative form + runtime validation |
| PDF | @react-pdf/renderer | Client-side, no headless browser |
| AI | OpenAI API (optional) | Structured outputs, gpt-4o-mini |
| Persistence | localStorage | Simple, no dependency |
