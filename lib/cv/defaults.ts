import { CVData } from '@/types/cv';

export function createEmptyCVData(): CVData {
  return {
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
    },
    summary: {
      es: '',
      en: '',
    },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    language: 'es',
  };
}

export function createExperienceEntry() {
  return {
    id: crypto.randomUUID(),
    company: '',
    position: { es: '', en: '' },
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    descriptions: { es: '', en: '' },
  };
}

export function createEducationEntry() {
  return {
    id: crypto.randomUUID(),
    institution: '',
    degree: { es: '', en: '' },
    field: { es: '', en: '' },
    startDate: '',
    endDate: '',
  };
}

export function createSkillCategory() {
  return {
    id: crypto.randomUUID(),
    category: '',
    skills: [],
  };
}

export function createLanguageEntry() {
  return {
    id: crypto.randomUUID(),
    language: '',
    level: '',
  };
}
