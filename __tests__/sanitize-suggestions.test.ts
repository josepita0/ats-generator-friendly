import { describe, it, expect, vi } from 'vitest';
import { sanitizeSuggestions } from '@/lib/ai/chat';
import type { CVData } from '@/types/cv';

// Mock crypto.randomUUID for deterministic IDs
vi.mock('crypto', () => ({
  randomUUID: vi.fn(() => 'mock-uuid'),
}));

const mockCVData: CVData = {
  personalInfo: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    location: 'New York, USA',
  },
  summary: { es: 'Resumen actual', en: 'Current summary' },
  experience: [
    {
      id: 'exp-1',
      company: 'Acme Corp',
      position: { es: 'Desarrollador', en: 'Developer' },
      current: false,
      descriptions: { es: 'Descripción actual', en: 'Current description' },
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
  skills: [],
  languages: [],
  language: 'en',
};

describe('sanitizeSuggestions', () => {
  it('returns empty array for non-array input', () => {
    const result = sanitizeSuggestions(null, mockCVData);
    expect(result).toEqual([]);
  });

  it('returns empty array for undefined input', () => {
    const result = sanitizeSuggestions(undefined, mockCVData);
    expect(result).toEqual([]);
  });

  it('filters out suggestions with non-existent entry IDs', () => {
    const rawSuggestions = [
      {
        section: 'experience',
        entryId: 'non-existent-id',
        field: 'position',
        lang: 'en',
        current: 'Developer',
        proposed: 'Senior Developer',
        rationale: 'More specific',
      },
    ];

    const result = sanitizeSuggestions(rawSuggestions, mockCVData);
    expect(result).toEqual([]);
  });

  it('filters out suggestions where current text does not match', () => {
    const rawSuggestions = [
      {
        section: 'experience',
        entryId: 'exp-1',
        field: 'position',
        lang: 'en',
        current: 'Wrong current text',
        proposed: 'Senior Developer',
        rationale: 'More specific',
      },
    ];

    const result = sanitizeSuggestions(rawSuggestions, mockCVData);
    expect(result).toEqual([]);
  });

  it('filters out suggestions where proposed equals current', () => {
    const rawSuggestions = [
      {
        section: 'experience',
        entryId: 'exp-1',
        field: 'position',
        lang: 'en',
        current: 'Developer',
        proposed: 'Developer',
        rationale: 'No change',
      },
    ];

    const result = sanitizeSuggestions(rawSuggestions, mockCVData);
    expect(result).toEqual([]);
  });

  it('accepts valid summary suggestion', () => {
    const rawSuggestions = [
      {
        section: 'summary',
        lang: 'en',
        current: 'Current summary',
        proposed: 'Improved summary with metrics',
        rationale: 'More impactful',
      },
    ];

    const result = sanitizeSuggestions(rawSuggestions, mockCVData);
    expect(result).toHaveLength(1);
    expect(result[0].target.kind).toBe('summary');
    expect(result[0].proposed).toBe('Improved summary with metrics');
  });

  it('accepts valid experience suggestion', () => {
    const rawSuggestions = [
      {
        section: 'experience',
        entryId: 'exp-1',
        field: 'descriptions',
        lang: 'en',
        current: 'Current description',
        proposed: 'Improved description with action verbs',
        rationale: 'Stronger impact',
      },
    ];

    const result = sanitizeSuggestions(rawSuggestions, mockCVData);
    expect(result).toHaveLength(1);
    expect(result[0].target.kind).toBe('experience');
    expect(result[0].target.entryId).toBe('exp-1');
  });

  it('accepts valid education suggestion', () => {
    const rawSuggestions = [
      {
        section: 'education',
        entryId: 'edu-1',
        field: 'degree',
        lang: 'en',
        current: 'Engineering',
        proposed: 'Software Engineering',
        rationale: 'More specific',
      },
    ];

    const result = sanitizeSuggestions(rawSuggestions, mockCVData);
    expect(result).toHaveLength(1);
    expect(result[0].target.kind).toBe('education');
  });

  it('filters out experience suggestion missing entryId', () => {
    const rawSuggestions = [
      {
        section: 'experience',
        field: 'position',
        lang: 'en',
        current: 'Developer',
        proposed: 'Senior Developer',
        rationale: 'More specific',
      },
    ];

    const result = sanitizeSuggestions(rawSuggestions, mockCVData);
    expect(result).toEqual([]);
  });

  it('filters out experience suggestion with invalid field', () => {
    const rawSuggestions = [
      {
        section: 'experience',
        entryId: 'exp-1',
        field: 'invalid-field',
        lang: 'en',
        current: 'Developer',
        proposed: 'Senior Developer',
        rationale: 'More specific',
      },
    ];

    const result = sanitizeSuggestions(rawSuggestions, mockCVData);
    expect(result).toEqual([]);
  });

  it('handles mixed valid and invalid suggestions', () => {
    const rawSuggestions = [
      {
        section: 'summary',
        lang: 'en',
        current: 'Current summary',
        proposed: 'Improved summary',
        rationale: 'Better',
      },
      {
        section: 'experience',
        entryId: 'non-existent',
        field: 'position',
        lang: 'en',
        current: 'Developer',
        proposed: 'Senior Developer',
        rationale: 'More specific',
      },
      {
        section: 'education',
        entryId: 'edu-1',
        field: 'degree',
        lang: 'en',
        current: 'Engineering',
        proposed: 'Software Engineering',
        rationale: 'More specific',
      },
    ];

    const result = sanitizeSuggestions(rawSuggestions, mockCVData);
    expect(result).toHaveLength(2);
    expect(result[0].target.kind).toBe('summary');
    expect(result[1].target.kind).toBe('education');
  });

  it('trims whitespace when comparing current text', () => {
    const rawSuggestions = [
      {
        section: 'summary',
        lang: 'en',
        current: '  Current summary  ',
        proposed: 'Improved summary',
        rationale: 'Better',
      },
    ];

    const result = sanitizeSuggestions(rawSuggestions, mockCVData);
    expect(result).toHaveLength(1);
  });
});
