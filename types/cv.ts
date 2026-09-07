export type Language = 'es' | 'en';

export interface BilingualText {
  es: string;
  en: string;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  generateQR?: boolean;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  position: BilingualText;
  location?: string;
  startDate?: string;
  endDate?: string;
  current: boolean;
  descriptions: BilingualText;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: BilingualText;
  field: BilingualText;
  startDate?: string;
  endDate?: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export interface LanguageEntry {
  id: string;
  language: string;
  level: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary: BilingualText;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillCategory[];
  languages: LanguageEntry[];
  language: Language;
}
