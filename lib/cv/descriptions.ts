import { CVData } from '@/types/cv';

const BULLET_RE = /^[\s]*([•·▪►✓✔●✦◆◇–—\-*]|\d+[.)]\s*|[a-z][.)]\s*)/;

export function parseBullets(text: string): { items: string[]; bullet: string } | null {
  if (!text) return null;
  const lines = text.split('\n').filter((l) => l.trim());
  if (lines.length <= 1) return null;
  const bulleted = lines.filter((l) => BULLET_RE.test(l.trim()));
  if (bulleted.length < 2) return null;
  const bullet = (bulleted[0].trim().match(BULLET_RE)?.[0] || '•').trim();
  const items = bulleted.map((l) => l.trim().replace(BULLET_RE, '').trim());
  return { items, bullet };
}

export function replaceBulletInDescriptions(data: CVData): CVData {
  const normalize = (s: string) => s.replace(/[●▪▸►○◉◎◈◆◇◌]/g, '-');
  return {
    ...data,
    experience: data.experience.map((exp) => ({
      ...exp,
      descriptions: {
        es: normalize(exp.descriptions.es),
        en: normalize(exp.descriptions.en),
      },
    })),
  };
}
