/** Abbreviated month names for CV date ranges (index 0 is empty for 1-based month numbers) */
export const MONTHS_ABBR_ES = ['', 'Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'];
export const MONTHS_ABBR_EN = ['', 'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

/** Full month names for cover letter dates (0-based, January = index 0) */
export const MONTHS_FULL_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export const MONTHS_FULL_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * Formats a date string (MM/YYYY or YYYY-MM) into "Mon YYYY" format.
 * Used by CVPreview and CVDocument for experience/education date ranges.
 */
export function formatDate(date: string | undefined, lang: 'es' | 'en'): string {
  if (!date) return '';
  const parts = date.split(/[\/-]/);
  if (parts.length !== 2) return date;
  let month = parts[0];
  let year = parts[1];
  if (parts[0].length === 4) {
    year = parts[0];
    month = parts[1];
  }
  const months = lang === 'en' ? MONTHS_ABBR_EN : MONTHS_ABBR_ES;
  const monthName = months[parseInt(month, 10)] || month;
  return `${monthName} ${year}`;
}

/**
 * Formats today's date for a cover letter header.
 * ES: "3 de septiembre de 2026"
 * EN: "September 3, 2026"
 */
export function formatCoverLetterDate(lang: 'es' | 'en'): string {
  const now = new Date();
  const day = now.getDate();
  const year = now.getFullYear();
  const months = lang === 'es' ? MONTHS_FULL_ES : MONTHS_FULL_EN;
  return lang === 'es'
    ? `${day} de ${months[now.getMonth()]} de ${year}`
    : `${months[now.getMonth()]} ${day}, ${year}`;
}
