import { CVData } from '@/types/cv';
import { BilingualText } from '@/types/cv';

const STORAGE_KEY = 'ats-cv-data';
const COVER_LETTER_KEY = 'ats-cover-letter';

export function saveCVData(data: CVData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn('Failed to save CV data to localStorage');
  }
}

export function loadCVData(): CVData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as CVData;
    }
  } catch {
    console.warn('Failed to load CV data from localStorage');
  }
  return null;
}

export function clearCVData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.warn('Failed to clear CV data from localStorage');
  }
}

export function saveCoverLetter(body: BilingualText): void {
  try {
    localStorage.setItem(COVER_LETTER_KEY, JSON.stringify(body));
  } catch {
    console.warn('Failed to save cover letter to localStorage');
  }
}

export function loadCoverLetter(): BilingualText | null {
  try {
    const stored = localStorage.getItem(COVER_LETTER_KEY);
    if (stored) {
      return JSON.parse(stored) as BilingualText;
    }
  } catch {
    console.warn('Failed to load cover letter from localStorage');
  }
  return null;
}

export function clearCoverLetter(): void {
  try {
    localStorage.removeItem(COVER_LETTER_KEY);
  } catch {
    console.warn('Failed to clear cover letter from localStorage');
  }
}
