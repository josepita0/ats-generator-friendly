import { useMemo } from 'react';
import type { CVData } from '@/types/cv';
import type { EditorSection } from '@/components/editor/types';

/* ── Reused verb lists (same as atsScoring.ts) ── */

const ACTION_VERBS_EN = [
  'Led', 'Developed', 'Implemented', 'Optimized', 'Designed', 'Built',
  'Managed', 'Created', 'Improved', 'Reduced', 'Increased', 'Launched',
  'Automated', 'Streamlined', 'Mentored', 'Architected', 'Delivered',
  'Spearheaded', 'Orchestrated', 'Coordinated', 'Established', 'Pioneered',
  'Simplified', 'Negotiated', 'Resolved', 'Trained', 'Supervised',
  'Engineered', 'Facilitated', 'Generated', 'Produced', 'Overhauled',
  'Analyzed', 'Evaluated', 'Integrated', 'Migrated', 'Refactored',
];

const ACTION_VERBS_ES = [
  'Dirigí', 'Desarrollé', 'Implementé', 'Optimisé', 'Diseñé', 'Construí',
  'Gestioné', 'Creé', 'Mejoré', 'Reduje', 'Incrementé', 'Lancé',
  'Automaticé', 'Simplifiqué', 'Mentoricé', 'Arquitecté', 'Entregué',
  'Lideré', 'Orquesté', 'Coordiné', 'Establecí', 'Inicié',
  'Negocié', 'Resolví', 'Capacité', 'Supervisé',
  'Ingenieré', 'Facilité', 'Generé', 'Produje', 'Reestructuré',
  'Analicé', 'Evalué', 'Integré', 'Migré', 'Refactoricé',
];

const COMMON_TECH_KEYWORDS = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java',
  'AWS', 'Docker', 'Kubernetes', 'Git', 'REST', 'SQL', 'NoSQL',
  'CI/CD', 'Agile', 'Scrum', 'GraphQL', 'MongoDB', 'PostgreSQL',
  'Redis', 'Azure', 'GCP', 'Linux', 'Nginx', 'Terraform',
  'HTML', 'CSS', 'Tailwind', 'Next.js', 'Vue', 'Angular',
  'Express', 'Django', 'Flask', 'Spring', '.NET', 'PHP',
  'RabbitMQ', 'Kafka', 'Elasticsearch', 'Jenkins', 'GitHub Actions',
];

/* ── Types ───────────────────────────────────── */

export interface SectionCheck {
  label: string;
  passed: boolean;
  message?: string;
}

export interface SectionRecommendation {
  type: 'warning' | 'suggestion' | 'success';
  message: string;
}

export interface SectionATSScore {
  score: number;
  checks: SectionCheck[];
  recommendations: SectionRecommendation[];
}

/* ── Helpers ─────────────────────────────────── */

function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

function hasActionVerb(sentence: string, verbs: string[]): boolean {
  const lower = sentence.toLowerCase();
  return verbs.some((v) => lower.startsWith(v.toLowerCase()));
}

function containsMetric(text: string): boolean {
  return /\d+%?|\$[\d,]+|\+\d+|[\d,.]+ (?:k|m|million|billion)/i.test(text);
}

function splitIntoBullets(text: string): string[] {
  if (!text.trim()) return [];
  return text
    .split(/\n/)
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter((line) => line.length > 0);
}

/* ── Main hook ───────────────────────────────── */

export function useSectionATSScore(
  cvData: CVData | null,
  section: EditorSection,
  lang: 'es' | 'en',
): SectionATSScore {
  return useMemo(() => {
    if (!cvData) {
      return { score: 0, checks: [], recommendations: [] };
    }

    switch (section) {
      case 'personal-info':
        return calculatePersonalInfoScore(cvData);
      case 'summary':
        return calculateSummaryScore(cvData, lang);
      case 'experience':
        return calculateExperienceScore(cvData, lang);
      case 'education':
        return calculateEducationScore(cvData);
      case 'skills':
        return calculateSkillsScore(cvData);
      case 'languages':
        return calculateLanguagesScore(cvData);
      default:
        return { score: 0, checks: [], recommendations: [] };
    }
  }, [cvData, section, lang]);
}

/* ── Per-section calculators ─────────────────── */

function calculatePersonalInfoScore(cvData: CVData): SectionATSScore {
  const checks: SectionCheck[] = [];
  const recommendations: SectionRecommendation[] = [];
  let score = 0;

  // Nombre completo
  if (cvData.personalInfo.name.trim().length > 0) {
    checks.push({ label: 'Nombre completo', passed: true });
    score += 20;
  } else {
    checks.push({ label: 'Nombre completo', passed: false, message: 'Requerido para ATS' });
    recommendations.push({ type: 'warning', message: 'Agregá tu nombre completo' });
  }

  // Email
  if (cvData.personalInfo.email.trim().length > 0) {
    checks.push({ label: 'Email de contacto', passed: true });
    score += 20;
  } else {
    checks.push({ label: 'Email de contacto', passed: false, message: 'Requerido para ATS' });
    recommendations.push({ type: 'warning', message: 'Agregá un email de contacto' });
  }

  // Teléfono
  if (cvData.personalInfo.phone.trim().length > 0) {
    checks.push({ label: 'Teléfono', passed: true });
    score += 15;
  } else {
    checks.push({ label: 'Teléfono', passed: false, message: 'Opcional pero recomendado' });
    recommendations.push({ type: 'suggestion', message: 'Agregar teléfono mejora tu score ATS' });
  }

  // Ubicación
  if (cvData.personalInfo.location.trim().length > 0) {
    checks.push({ label: 'Ubicación', passed: true });
    score += 15;
  } else {
    checks.push({ label: 'Ubicación', passed: false, message: 'Recomendado para ATS' });
    recommendations.push({ type: 'suggestion', message: 'Agregá tu ubicación (ciudad, país)' });
  }

  // LinkedIn
  if ((cvData.personalInfo.linkedin ?? '').trim().length > 0) {
    checks.push({ label: 'Perfil LinkedIn', passed: true });
    score += 15;
  } else {
    checks.push({ label: 'Perfil LinkedIn', passed: false });
    recommendations.push({ type: 'suggestion', message: 'Agregar LinkedIn es altamente recomendado' });
  }

  // Sitio web/Portfolio
  if ((cvData.personalInfo.website ?? '').trim().length > 0) {
    checks.push({ label: 'Portfolio / sitio web', passed: true });
    score += 15;
  } else {
    checks.push({ label: 'Portfolio / sitio web', passed: false });
  }

  return { score, checks, recommendations };
}

function calculateSummaryScore(cvData: CVData, lang: 'es' | 'en'): SectionATSScore {
  const checks: SectionCheck[] = [];
  const recommendations: SectionRecommendation[] = [];
  let score = 0;

  const summary = cvData.summary[lang];
  const wordCount = summary.trim().split(/\s+/).filter(Boolean).length;
  const verbs = lang === 'es' ? ACTION_VERBS_ES : ACTION_VERBS_EN;

  // Tiene resumen
  if (wordCount > 0) {
    checks.push({ label: 'Resumen presente', passed: true });
    score += 30;
  } else {
    checks.push({ label: 'Resumen presente', passed: false, message: 'Requerido para ATS' });
    recommendations.push({ type: 'warning', message: 'Agregá un resumen profesional' });
  }

  // Longitud óptima (50-150 palabras)
  if (wordCount >= 50 && wordCount <= 150) {
    checks.push({ label: 'Longitud óptima (50-150 palabras)', passed: true });
    score += 30;
  } else if (wordCount > 0) {
    checks.push({ label: 'Longitud óptima (50-150 palabras)', passed: false, message: `${wordCount} palabras` });
    recommendations.push({ type: 'suggestion', message: 'El resumen ideal tiene 50-150 palabras' });
  }

  // Contiene verbos de acción
  const hasActionVerbs = verbs.some((v) => summary.toLowerCase().includes(v.toLowerCase()));
  if (hasActionVerbs) {
    checks.push({ label: 'Verbos de acción', passed: true });
    score += 20;
  } else if (wordCount > 0) {
    checks.push({ label: 'Verbos de acción', passed: false });
    recommendations.push({
      type: 'suggestion',
      message: lang === 'es'
        ? 'Incluí verbos de acción (Dirigí, Desarrollé, Implementé)'
        : 'Incluí verbos de acción (Led, Developed, Implemented)',
    });
  }

  // Contiene métricas
  const hasMetrics = containsMetric(summary);
  if (hasMetrics) {
    checks.push({ label: 'Métricas cuantificables', passed: true });
    score += 20;
  } else if (wordCount > 0) {
    checks.push({ label: 'Métricas cuantificables', passed: false });
    recommendations.push({ type: 'suggestion', message: 'Agregar métricas (%, $, cantidades) aumenta el impacto' });
  }

  return { score, checks, recommendations };
}

function calculateExperienceScore(cvData: CVData, lang: 'es' | 'en'): SectionATSScore {
  const checks: SectionCheck[] = [];
  const recommendations: SectionRecommendation[] = [];
  let score = 0;

  const { experience } = cvData;
  const verbs = lang === 'es' ? ACTION_VERBS_ES : ACTION_VERBS_EN;

  // Tiene experiencia
  if (experience.length > 0) {
    checks.push({ label: 'Experiencia laboral presente', passed: true });
    score += 20;
  } else {
    checks.push({ label: 'Experiencia laboral presente', passed: false, message: 'Requerido para ATS' });
    recommendations.push({ type: 'warning', message: 'Agregá al menos una experiencia laboral' });
    return { score, checks, recommendations };
  }

  // Múltiples experiencias (2-5 ideal)
  if (experience.length >= 2 && experience.length <= 5) {
    checks.push({ label: 'Cantidad de experiencias (2-5)', passed: true });
    score += 10;
  } else if (experience.length > 0) {
    checks.push({ label: 'Cantidad de experiencias (2-5)', passed: false, message: `${experience.length} experiencia(s)` });
  }

  // Analizar bullets en todas las experiencias
  let totalBullets = 0;
  let bulletsWithVerb = 0;
  let bulletsWithMetric = 0;
  let bulletsWithGoodLength = 0;

  for (const exp of experience) {
    const desc = exp.descriptions[lang];
    const bullets = splitIntoBullets(desc);
    totalBullets += bullets.length;

    for (const bullet of bullets) {
      if (hasActionVerb(bullet, verbs)) bulletsWithVerb++;
      if (containsMetric(bullet)) bulletsWithMetric++;
      const wc = countWords(bullet);
      if (wc >= 10 && wc <= 35) bulletsWithGoodLength++;
    }
  }

  // Tiene descripciones
  if (totalBullets > 0) {
    checks.push({ label: 'Descripciones con viñetas', passed: true });
    score += 10;
  } else {
    checks.push({ label: 'Descripciones con viñetas', passed: false, message: 'Agregá descripciones con viñetas' });
    recommendations.push({ type: 'warning', message: 'Agregá descripciones detalladas a tus experiencias' });
  }

  // Ratio de verbos de acción
  if (totalBullets > 0) {
    const verbRatio = bulletsWithVerb / totalBullets;
    if (verbRatio >= 0.7) {
      checks.push({ label: 'Verbos de acción', passed: true });
      score += 25;
    } else if (verbRatio > 0) {
      checks.push({ label: 'Verbos de acción', passed: false, message: `${Math.round(verbRatio * 100)}% con verbos` });
      recommendations.push({
        type: 'suggestion',
        message: lang === 'es'
          ? 'Usá verbos de acción al inicio de cada viñeta (Dirigí, Desarrollé, Optimicé)'
          : 'Usá verbos de acción al inicio de cada viñeta (Led, Developed, Optimized)',
      });
      score += 12;
    } else {
      checks.push({ label: 'Verbos de acción', passed: false });
      recommendations.push({
        type: 'warning',
        message: lang === 'es'
          ? 'Iniciá tus logros con verbos de acción'
          : 'Start achievements with action verbs',
      });
    }
  }

  // Ratio de métricas
  if (totalBullets > 0) {
    const metricRatio = bulletsWithMetric / totalBullets;
    if (metricRatio >= 0.5) {
      checks.push({ label: 'Logros cuantificables', passed: true });
      score += 25;
    } else if (metricRatio > 0) {
      checks.push({ label: 'Logros cuantificables', passed: false, message: `${Math.round(metricRatio * 100)}% con métricas` });
      recommendations.push({ type: 'suggestion', message: 'Agregá métricas cuantificables en más viñetas (%, $, cantidades)' });
      score += 12;
    } else {
      checks.push({ label: 'Logros cuantificables', passed: false });
      recommendations.push({ type: 'warning', message: 'Agregá métricas cuantificables a tus logros' });
    }
  }

  // Longitud de bullets
  if (totalBullets > 0) {
    const lengthRatio = bulletsWithGoodLength / totalBullets;
    if (lengthRatio >= 0.7) {
      checks.push({ label: 'Longitud óptima de viñetas (10-35 palabras)', passed: true });
      score += 10;
    } else {
      checks.push({ label: 'Longitud óptima de viñetas (10-35 palabras)', passed: false, message: `${Math.round(lengthRatio * 100)}% óptimas` });
      recommendations.push({ type: 'suggestion', message: 'Mantené las viñetas entre 10 y 35 palabras para mejor legibilidad' });
    }
  }

  return { score, checks, recommendations };
}

function calculateEducationScore(cvData: CVData): SectionATSScore {
  const checks: SectionCheck[] = [];
  const recommendations: SectionRecommendation[] = [];
  let score = 0;

  if (cvData.education.length > 0) {
    checks.push({ label: 'Educación presente', passed: true });
    score += 50;

    // Fechas completas
    const withDates = cvData.education.filter((edu) => edu.startDate && edu.endDate).length;
    if (withDates === cvData.education.length) {
      checks.push({ label: 'Fechas completas', passed: true });
      score += 25;
    } else {
      checks.push({ label: 'Fechas completas', passed: false, message: `${withDates}/${cvData.education.length} completas` });
      recommendations.push({ type: 'suggestion', message: 'Agregá fechas de inicio y fin' });
    }

    // Título/carrera
    const withDegree = cvData.education.filter((edu) => edu.degree.es || edu.degree.en).length;
    if (withDegree === cvData.education.length) {
      checks.push({ label: 'Títulos / certificaciones', passed: true });
      score += 25;
    } else {
      checks.push({ label: 'Títulos / certificaciones', passed: false });
      recommendations.push({ type: 'suggestion', message: 'Completá títulos o certificaciones' });
    }
  } else {
    checks.push({ label: 'Educación presente', passed: false, message: 'Recomendado para ATS' });
    recommendations.push({ type: 'suggestion', message: 'Agregá educación (incluyendo cursos relevantes)' });
  }

  return { score, checks, recommendations };
}

function calculateSkillsScore(cvData: CVData): SectionATSScore {
  const checks: SectionCheck[] = [];
  const recommendations: SectionRecommendation[] = [];
  let score = 0;

  const totalSkills = cvData.skills.reduce((sum, cat) => sum + cat.skills.length, 0);

  if (cvData.skills.length > 0) {
    checks.push({ label: 'Habilidades presentes', passed: true });
    score += 25;
  } else {
    checks.push({ label: 'Habilidades presentes', passed: false, message: 'Requerido para ATS' });
    recommendations.push({ type: 'warning', message: 'Agregá habilidades técnicas' });
    return { score, checks, recommendations };
  }

  // Cantidad de habilidades (10-20 ideal)
  if (totalSkills >= 10 && totalSkills <= 20) {
    checks.push({ label: 'Cantidad de habilidades (10-20)', passed: true });
    score += 25;
  } else if (totalSkills >= 5) {
    checks.push({ label: 'Cantidad de habilidades (10-20)', passed: false, message: `${totalSkills} habilidades` });
    score += 15;
    if (totalSkills < 10) {
      recommendations.push({ type: 'suggestion', message: 'Agregá más habilidades (ideal: 10-20)' });
    }
  } else if (totalSkills > 0) {
    checks.push({ label: 'Cantidad de habilidades (10-20)', passed: false, message: `${totalSkills} habilidades` });
    recommendations.push({ type: 'suggestion', message: 'Agregá más habilidades (ideal: 10-20)' });
    score += 10;
  }

  // Categorías (2-5 ideal)
  if (cvData.skills.length >= 2 && cvData.skills.length <= 5) {
    checks.push({ label: 'Categorías organizadas (2-5)', passed: true });
    score += 25;
  } else if (cvData.skills.length > 0) {
    checks.push({ label: 'Categorías organizadas (2-5)', passed: false, message: `${cvData.skills.length} categorías` });
    recommendations.push({ type: 'suggestion', message: 'Organizá tus habilidades en 2-5 categorías' });
    score += 10;
  }

  // Keywords tecnológicas relevantes
  const allSkills = cvData.skills.flatMap((cat) => cat.skills.map((s) => s.toLowerCase()));
  const matchedKeywords = COMMON_TECH_KEYWORDS.filter((kw) =>
    allSkills.some((skill) => skill.includes(kw.toLowerCase())),
  );

  if (matchedKeywords.length >= 3) {
    checks.push({ label: 'Keywords tecnológicas relevantes', passed: true });
    score += 25;
  } else if (matchedKeywords.length > 0) {
    checks.push({ label: 'Keywords tecnológicas relevantes', passed: false, message: `${matchedKeywords.length} keywords comunes encontradas` });
    score += 12;
    const missing = COMMON_TECH_KEYWORDS.filter(
      (kw) => !allSkills.some((s) => s.includes(kw.toLowerCase())),
    ).slice(0, 3);
    if (missing.length > 0) {
      recommendations.push({ type: 'suggestion', message: `Considerá agregar: ${missing.join(', ')}` });
    }
  } else {
    checks.push({ label: 'Keywords tecnológicas relevantes', passed: false });
    const missing = COMMON_TECH_KEYWORDS.slice(0, 3);
    recommendations.push({ type: 'suggestion', message: 'Incluí tecnologías demandadas: ' + missing.join(', ') });
  }

  return { score, checks, recommendations };
}

function calculateLanguagesScore(cvData: CVData): SectionATSScore {
  const checks: SectionCheck[] = [];
  const recommendations: SectionRecommendation[] = [];
  let score = 0;

  if (cvData.languages.length > 0) {
    checks.push({ label: 'Idiomas presentes', passed: true });
    score += 40;

    // Múltiples idiomas
    if (cvData.languages.length >= 2) {
      checks.push({ label: 'Múltiples idiomas', passed: true });
      score += 30;
    } else {
      checks.push({ label: 'Múltiples idiomas', passed: false, message: 'Solo 1 idioma' });
      recommendations.push({ type: 'suggestion', message: 'Agregá más idiomas si los conocés' });
    }

    // Niveles definidos
    const withLevel = cvData.languages.filter((lang) => lang.level.trim().length > 0).length;
    if (withLevel === cvData.languages.length) {
      checks.push({ label: 'Niveles de dominio definidos', passed: true });
      score += 30;
    } else {
      checks.push({ label: 'Niveles de dominio definidos', passed: false, message: `${withLevel}/${cvData.languages.length} con nivel` });
      recommendations.push({ type: 'suggestion', message: 'Definí el nivel de dominio para cada idioma (A1-C2)' });
    }
  } else {
    checks.push({ label: 'Idiomas presentes', passed: false, message: 'Recomendado para ATS' });
    recommendations.push({ type: 'suggestion', message: 'Agregá los idiomas que hablás' });
  }

  return { score, checks, recommendations };
}
