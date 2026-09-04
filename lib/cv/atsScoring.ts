import type { CVData, BilingualText } from '@/types/cv';

/* ── Action verb lists ───────────────────────── */

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
  'Simplifiqué', 'Negocié', 'Resolví', 'Capacité', 'Supervisé',
  'Ingenieré', 'Facilité', 'Generé', 'Produje', 'Reestructuré',
  'Analicé', 'Evalué', 'Integré', 'Migré', 'Refactoricé',
];

/* ── Common tech keywords for keyword analysis ─ */

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

export interface ATSScoreResult {
  overall: number;
  breakdown: {
    structure: { score: number; weight: number; details: string };
    content: { score: number; weight: number; details: string };
    keywords: { score: number; weight: number; details: string };
    formatting: { score: number; weight: number; details: string };
  };
  suggestions: string[];
}

/* ── Helpers ─────────────────────────────────── */

function textLength(bt: BilingualText, lang: 'es' | 'en'): number {
  return (bt[lang] || '').trim().length;
}

function splitIntoBullets(text: string): string[] {
  if (!text.trim()) return [];
  return text
    .split(/\n/)
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter((line) => line.length > 0);
}

function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

function hasActionVerb(sentence: string, verbs: string[]): boolean {
  const lower = sentence.toLowerCase();
  return verbs.some((v) => lower.startsWith(v.toLowerCase()));
}

function containsMetric(text: string): boolean {
  // Matches: numbers, percentages, dollar amounts, increases with +
  return /\d+%?|\$\d+|\+\d+|[\d,.]+ (?:k|m|million|billion)/i.test(text);
}

function isConsistentDateFormat(dateStr: string): boolean {
  if (!dateStr) return true; // empty is ok
  // Accepts MM/YYYY, YYYY-MM, YYYY, YYYY/MM/DD
  return /^(?:\d{4}(?:[-/]\d{2}(?:[-/]\d{2})?)?|(?:\d{2}[-/]\d{4}))$/.test(dateStr);
}

/* ── Main scoring function ───────────────────── */

export function computeATSScore(data: CVData, lang: 'es' | 'en'): ATSScoreResult {
  const suggestions: string[] = [];

  // ── 1. Structure (25%) ─────────────────────────
  const hasName = (data.personalInfo.name || '').trim().length > 0;
  const hasEmail = (data.personalInfo.email || '').trim().length > 0;
  const hasPhone = (data.personalInfo.phone || '').trim().length > 0;
  const hasSummary = textLength(data.summary, lang) > 0;
  const hasExperience = data.experience.length > 0;
  const hasEducation = data.education.length > 0;
  const totalSkills = data.skills.reduce((acc, cat) => acc + cat.skills.length, 0);
  const hasSkills = totalSkills >= 3;

  const structureChecks = [
    { label: 'Nombre', passed: hasName },
    { label: 'Email', passed: hasEmail },
    { label: 'Teléfono', passed: hasPhone },
    { label: 'Resumen profesional', passed: hasSummary },
    { label: 'Al menos 1 experiencia', passed: hasExperience },
    { label: 'Al menos 1 formación', passed: hasEducation },
    { label: 'Al menos 3 habilidades', passed: hasSkills },
  ];

  const structureScore = Math.round(
    (structureChecks.filter((c) => c.passed).length / structureChecks.length) * 100,
  );

  if (!hasSummary) {
    suggestions.push('Agregá un resumen profesional para captar la atención del reclutador.');
  }
  if (!hasExperience) {
    suggestions.push('Incluí al menos una experiencia laboral relevante.');
  }
  if (!hasEducation) {
    suggestions.push('Agregá tu formación académica.');
  }
  if (!hasSkills) {
    suggestions.push('Incluí al menos 3 habilidades técnicas o blandas.');
  }

  // ── 2. Content Quality (35%) ───────────────────
  const verbs = lang === 'es' ? ACTION_VERBS_ES : ACTION_VERBS_EN;
  let totalBullets = 0;
  let bulletsWithVerb = 0;
  let bulletsWithMetric = 0;
  let bulletsWithGoodLength = 0;

  for (const exp of data.experience) {
    const descText = exp.descriptions[lang] || '';
    const bullets = splitIntoBullets(descText);
    totalBullets += bullets.length;

    for (const bullet of bullets) {
      if (hasActionVerb(bullet, verbs)) bulletsWithVerb++;
      if (containsMetric(bullet)) bulletsWithMetric++;

      const wc = countWords(bullet);
      if (wc >= 10 && wc <= 35) bulletsWithGoodLength++;
    }
  }

  // Calculate sub-scores (0-100 each)
  const verbScore = totalBullets === 0
    ? 0
    : Math.round((bulletsWithVerb / totalBullets) * 100);

  const metricScore = totalBullets === 0
    ? 0
    : Math.round((bulletsWithMetric / totalBullets) * 100);

  const lengthScore = totalBullets === 0
    ? 0
    : Math.round((bulletsWithGoodLength / totalBullets) * 100);

  // Summary length: 2-4 sentences ideal (~50-200 words)
  const summaryWords = countWords(data.summary[lang] || '');
  const summaryScore = summaryWords >= 30 && summaryWords <= 250
    ? 100
    : summaryWords > 0
      ? 60
      : 0;

  const contentScore = Math.round(
    verbScore * 0.3 + metricScore * 0.3 + lengthScore * 0.25 + summaryScore * 0.15,
  );

  if (totalBullets > 0 && bulletsWithVerb / totalBullets < 0.5) {
    suggestions.push(
      lang === 'es'
        ? 'Usá más verbos de acción al inicio de cada bullet (ej: "Desarrollé", "Implementé").'
        : 'Use more action verbs at the start of each bullet (e.g., "Led", "Developed").',
    );
  }
  if (totalBullets > 0 && bulletsWithMetric / totalBullets < 0.3) {
    suggestions.push(
      lang === 'es'
        ? 'Agregá métricas cuantificables (ej: "aumenté el rendimiento un 30%").'
        : 'Add quantifiable metrics (e.g., "increased performance by 30%").',
    );
  }
  if (totalBullets > 0 && bulletsWithGoodLength / totalBullets < 0.5) {
    suggestions.push(
      lang === 'es'
        ? 'Mantené los bullets entre 10 y 35 palabras para mejor legibilidad.'
        : 'Keep bullets between 10 and 35 words for better readability.',
    );
  }
  if (totalBullets === 0 && hasExperience) {
    suggestions.push(
      lang === 'es'
        ? 'Agregá descripciones detalladas a tus experiencias laborales.'
        : 'Add detailed descriptions to your work experiences.',
    );
  }

  // ── 3. Keywords (25%) ──────────────────────────
  const allSkills = data.skills.flatMap((c) => c.skills);
  const uniqueSkills = new Set(allSkills.map((s) => s.toLowerCase()));
  const skillCount = uniqueSkills.size;

  // How many common tech keywords are present
  const matchedKeywords = COMMON_TECH_KEYWORDS.filter((kw) =>
    uniqueSkills.has(kw.toLowerCase()),
  );
  const keywordMatchRatio = Math.min(1, matchedKeywords.length / 8); // 8+ keywords = max

  // Skill count score: 0 skills = 0, 3 = 50, 6+ = 100
  const skillCountScore = Math.min(100, Math.round((skillCount / 6) * 100));

  const keywordScore = Math.round(skillCountScore * 0.5 + keywordMatchRatio * 100 * 0.5);

  // Suggest missing keywords
  const missingKeywords = COMMON_TECH_KEYWORDS.filter(
    (kw) => !uniqueSkills.has(kw.toLowerCase()),
  ).slice(0, 3);

  if (skillCount < 5) {
    suggestions.push(
      lang === 'es'
        ? 'Agregá al menos 5 habilidades técnicas para mejorar tu perfil.'
        : 'Add at least 5 technical skills to strengthen your profile.',
    );
  }
  if (missingKeywords.length > 0) {
    suggestions.push(
      lang === 'es'
        ? `Considerá agregar keywords como: ${missingKeywords.join(', ')}.`
        : `Consider adding keywords like: ${missingKeywords.join(', ')}.`,
    );
  }

  // ── 4. Formatting (15%) ────────────────────────
  const contactScore = [hasEmail, hasPhone, data.personalInfo.location.trim().length > 0]
    .filter(Boolean).length;

  // Check date format consistency
  const allDates = [
    ...data.experience.flatMap((e) => [e.startDate, e.endDate]),
    ...data.education.flatMap((e) => [e.startDate, e.endDate]),
  ].filter(Boolean) as string[];

  const consistentDates = allDates.length === 0 || allDates.every(isConsistentDateFormat);

  // Check for problematic characters (emojis, special symbols)
  const allText = [
    data.personalInfo.name,
    data.summary[lang] || '',
    ...data.experience.flatMap((e) => [
      e.company,
      e.position[lang] || '',
      e.descriptions[lang] || '',
    ]),
    ...data.education.flatMap((e) => [
      e.institution,
      e.degree[lang] || '',
      e.field[lang] || '',
    ]),
  ].join(' ');

  // Look for characters that might break ATS extraction
  const hasProblematicChars = /[\u{1F600}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(allText);

  const contactScorePct = Math.round((contactScore / 3) * 100);
  const dateScore = consistentDates ? 100 : 50;
  const charScore = hasProblematicChars ? 50 : 100;

  const formattingScore = Math.round(contactScorePct * 0.5 + dateScore * 0.25 + charScore * 0.25);

  if (!hasEmail || !hasPhone) {
    suggestions.push(
      lang === 'es'
        ? 'Completá tu información de contacto (email y teléfono).'
        : 'Complete your contact information (email and phone).',
    );
  }
  if (!consistentDates) {
    suggestions.push(
      lang === 'es'
        ? 'Usá un formato de fecha consistente (MM/YYYY) en todas las entradas.'
        : 'Use a consistent date format (MM/YYYY) across all entries.',
    );
  }

  // ── Weighted overall score ─────────────────────
  const WEIGHTS = { structure: 0.25, content: 0.35, keywords: 0.25, formatting: 0.15 };
  const overall = Math.round(
    structureScore * WEIGHTS.structure +
    contentScore * WEIGHTS.content +
    keywordScore * WEIGHTS.keywords +
    formattingScore * WEIGHTS.formatting,
  );

  return {
    overall: Math.min(100, Math.max(0, overall)),
    breakdown: {
      structure: {
        score: structureScore,
        weight: WEIGHTS.structure,
        details: `${structureChecks.filter((c) => c.passed).length}/${structureChecks.length} secciones completas`,
      },
      content: {
        score: contentScore,
        weight: WEIGHTS.content,
        details: totalBullets > 0
          ? `${bulletsWithVerb}/${totalBullets} bullets con verbo de acción, ${bulletsWithMetric}/${totalBullets} con métricas`
          : 'Sin bullets de experiencia',
      },
      keywords: {
        score: keywordScore,
        weight: WEIGHTS.keywords,
        details: `${skillCount} habilidades, ${matchedKeywords.length} keywords comunes detectadas`,
      },
      formatting: {
        score: formattingScore,
        weight: WEIGHTS.formatting,
        details: `${contactScore}/3 datos de contacto, ${consistentDates ? 'fechas consistentes' : 'fechas inconsistentes'}`,
      },
    },
    suggestions,
  };
}
