import { CVData } from '@/types/cv';

const STORAGE_KEY = 'ats-cv-data';

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
