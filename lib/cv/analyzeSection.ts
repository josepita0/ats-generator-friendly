import type { CVData } from '@/types/cv';
import type { EditorSection } from '@/components/editor/types';

/* ── Types ───────────────────────────────────── */

export interface SectionAnalysisInput {
  content: string;
  context?: string;
}

/* ── Main function ───────────────────────────── */

export function getSectionContentForAnalysis(
  cvData: CVData,
  section: EditorSection,
  lang: 'es' | 'en',
): SectionAnalysisInput | null {
  switch (section) {
    case 'summary':
      return analyzeSummary(cvData, lang);

    case 'experience':
      return analyzeExperience(cvData, lang);

    case 'education':
      return analyzeEducation(cvData, lang);

    case 'skills':
      return analyzeSkills(cvData);

    case 'languages':
      return analyzeLanguages(cvData);

    case 'personal-info':
      // Personal info is structural, not free-text — no AI analysis needed
      return null;

    default:
      return null;
  }
}

/* ── Per-section extractors ──────────────────── */

function analyzeSummary(cvData: CVData, lang: 'es' | 'en'): SectionAnalysisInput | null {
  const summary = cvData.summary[lang];

  if (!summary || summary.trim().length === 0) {
    return null;
  }

  return {
    content: summary,
    context:
      lang === 'es'
        ? 'Analizar el resumen profesional y sugerir mejoras de impacto, claridad y keywords ATS.'
        : 'Analyze the professional summary and suggest improvements for impact, clarity, and ATS keywords.',
  };
}

function analyzeExperience(cvData: CVData, lang: 'es' | 'en'): SectionAnalysisInput | null {
  const { experience } = cvData;

  if (experience.length === 0) {
    return null;
  }

  const items = experience
    .filter((exp) => exp.descriptions[lang] || exp.position[lang])
    .map((exp) => ({
      id: exp.id,
      company: exp.company,
      position: exp.position[lang] || '',
      descriptions: exp.descriptions[lang] || '',
    }));

  if (items.length === 0) {
    return null;
  }

  const content = items
    .map(
      (item) =>
        `[${item.id}] ${item.company} — ${item.position}\n${item.descriptions}`,
    )
    .join('\n\n---\n\n');

  return {
    content,
    context:
      lang === 'es'
        ? 'Analizar logros y responsabilidades. Sugerir verbos de acción fuertes, métricas cuantificables, y longitud óptima por bullet (10-35 palabras). Cada bullet debe empezar con -'
        : 'Analyze achievements and responsibilities. Suggest strong action verbs, quantifiable metrics, and optimal bullet length (10-35 words each). Each bullet should start with -',
  };
}

function analyzeEducation(cvData: CVData, lang: 'es' | 'en'): SectionAnalysisInput | null {
  const { education } = cvData;

  if (education.length === 0) {
    return null;
  }

  const items = education
    .filter((edu) => edu.degree[lang] || edu.field[lang])
    .map((edu) => ({
      institution: edu.institution,
      degree: edu.degree[lang] || '',
      field: edu.field[lang] || '',
    }));

  if (items.length === 0) {
    return null;
  }

  const content = items
    .map((item) => `${item.institution} — ${item.degree} (${item.field})`)
    .join('\n');

  return {
    content,
    context:
      lang === 'es'
        ? 'Sugerir mejoras para destacar logros académicos, certificaciones relevantes y cursos complementarios.'
        : 'Suggest improvements to highlight academic achievements, relevant certifications, and complementary courses.',
  };
}

function analyzeSkills(cvData: CVData): SectionAnalysisInput | null {
  const { skills } = cvData;

  if (skills.length === 0) {
    return null;
  }

  const content = skills
    .map((cat) => `${cat.category}: ${cat.skills.join(', ')}`)
    .join('\n');

  return {
    content,
    context:
      'Analyze technical skills and suggest relevant ATS keywords, missing in-demand technologies, and category organization improvements.',
  };
}

function analyzeLanguages(cvData: CVData): SectionAnalysisInput | null {
  const { languages } = cvData;

  if (languages.length === 0) {
    return null;
  }

  const content = languages.map((l) => `${l.language} (${l.level})`).join(', ');

  return {
    content,
    context:
      'Suggest standardized proficiency descriptions and identify any missing languages that could strengthen the profile.',
  };
}
