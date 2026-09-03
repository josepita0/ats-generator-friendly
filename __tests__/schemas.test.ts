import { describe, it, expect } from 'vitest';
import {
  cvDataSchema,
  personalInfoSchema,
  experienceEntrySchema,
  educationEntrySchema,
  skillCategorySchema,
  languageEntrySchema,
  bilingualTextSchema,
} from '@/lib/cv/schemas';

describe('bilingualTextSchema', () => {
  it('accepts valid bilingual text', () => {
    const result = bilingualTextSchema.safeParse({ es: 'Hola', en: 'Hello' });
    expect(result.success).toBe(true);
  });

  it('rejects missing language field', () => {
    const result = bilingualTextSchema.safeParse({ es: 'Hola' });
    expect(result.success).toBe(false);
  });

  it('rejects non-string values', () => {
    const result = bilingualTextSchema.safeParse({ es: 123, en: 'Hello' });
    expect(result.success).toBe(false);
  });
});

describe('personalInfoSchema', () => {
  it('accepts valid personal info', () => {
    const result = personalInfoSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      location: 'New York, USA',
      linkedin: 'linkedin.com/in/johndoe',
      website: 'johndoe.com',
    });
    expect(result.success).toBe(true);
  });

  it('accepts minimal valid info (no optional fields)', () => {
    const result = personalInfoSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      location: 'New York, USA',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = personalInfoSchema.safeParse({
      name: 'John Doe',
      email: 'not-an-email',
      phone: '+1234567890',
      location: 'New York, USA',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty name', () => {
    const result = personalInfoSchema.safeParse({
      name: '',
      email: 'john@example.com',
      phone: '+1234567890',
      location: 'New York, USA',
    });
    expect(result.success).toBe(false);
  });
});

describe('experienceEntrySchema', () => {
  it('accepts valid experience entry', () => {
    const result = experienceEntrySchema.safeParse({
      id: 'exp-1',
      company: 'Acme Corp',
      position: { es: 'Desarrollador', en: 'Developer' },
      location: 'Remote',
      startDate: '01/2020',
      endDate: '12/2022',
      current: false,
      descriptions: { es: 'Descripción', en: 'Description' },
    });
    expect(result.success).toBe(true);
  });

  it('accepts entry with optional fields omitted', () => {
    const result = experienceEntrySchema.safeParse({
      id: 'exp-1',
      company: 'Acme Corp',
      position: { es: 'Desarrollador', en: 'Developer' },
      current: false,
      descriptions: { es: 'Descripción', en: 'Description' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing company', () => {
    const result = experienceEntrySchema.safeParse({
      id: 'exp-1',
      position: { es: 'Desarrollador', en: 'Developer' },
      current: false,
      descriptions: { es: 'Descripción', en: 'Description' },
    });
    expect(result.success).toBe(false);
  });
});

describe('educationEntrySchema', () => {
  it('accepts valid education entry', () => {
    const result = educationEntrySchema.safeParse({
      id: 'edu-1',
      institution: 'MIT',
      degree: { es: 'Ingeniería', en: 'Engineering' },
      field: { es: 'Computación', en: 'Computer Science' },
      startDate: '09/2016',
      endDate: '06/2020',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing institution', () => {
    const result = educationEntrySchema.safeParse({
      id: 'edu-1',
      degree: { es: 'Ingeniería', en: 'Engineering' },
      field: { es: 'Computación', en: 'Computer Science' },
    });
    expect(result.success).toBe(false);
  });
});

describe('skillCategorySchema', () => {
  it('accepts valid skill category', () => {
    const result = skillCategorySchema.safeParse({
      id: 'skill-1',
      category: 'Programming',
      skills: ['JavaScript', 'TypeScript', 'Python'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty skills array', () => {
    const result = skillCategorySchema.safeParse({
      id: 'skill-1',
      category: 'Programming',
      skills: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing category', () => {
    const result = skillCategorySchema.safeParse({
      id: 'skill-1',
      skills: ['JavaScript'],
    });
    expect(result.success).toBe(false);
  });
});

describe('languageEntrySchema', () => {
  it('accepts valid language entry', () => {
    const result = languageEntrySchema.safeParse({
      id: 'lang-1',
      language: 'English',
      level: 'Native',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty language', () => {
    const result = languageEntrySchema.safeParse({
      id: 'lang-1',
      language: '',
      level: 'Native',
    });
    expect(result.success).toBe(false);
  });
});

describe('cvDataSchema', () => {
  it('accepts valid complete CV data', () => {
    const result = cvDataSchema.safeParse({
      personalInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        location: 'New York, USA',
      },
      summary: { es: 'Resumen', en: 'Summary' },
      experience: [
        {
          id: 'exp-1',
          company: 'Acme Corp',
          position: { es: 'Desarrollador', en: 'Developer' },
          current: false,
          descriptions: { es: 'Descripción', en: 'Description' },
        },
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'MIT',
          degree: { es: 'Ingeniería', en: 'Engineering' },
          field: { es: 'Computación', en: 'Computer Science' },
        },
      ],
      skills: [
        {
          id: 'skill-1',
          category: 'Programming',
          skills: ['JavaScript'],
        },
      ],
      languages: [
        {
          id: 'lang-1',
          language: 'English',
          level: 'Native',
        },
      ],
      language: 'en',
    });
    expect(result.success).toBe(true);
  });

  it('accepts minimal CV data (empty arrays)', () => {
    const result = cvDataSchema.safeParse({
      personalInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        location: 'New York, USA',
      },
      summary: { es: '', en: '' },
      experience: [],
      education: [],
      skills: [],
      languages: [],
      language: 'es',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid language enum', () => {
    const result = cvDataSchema.safeParse({
      personalInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        location: 'New York, USA',
      },
      summary: { es: '', en: '' },
      experience: [],
      education: [],
      skills: [],
      languages: [],
      language: 'fr',
    });
    expect(result.success).toBe(false);
  });
});
