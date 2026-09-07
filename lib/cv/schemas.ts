import { z } from 'zod';

export const bilingualTextSchema = z.object({
  es: z.string(),
  en: z.string(),
});

export const personalInfoSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  location: z.string().min(1),
  linkedin: z.string().optional(),
  website: z.string().optional(),
  generateQR: z.boolean().optional().default(false),
});

export const experienceEntrySchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  position: bilingualTextSchema,
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean(),
  descriptions: bilingualTextSchema,
});

export const educationEntrySchema = z.object({
  id: z.string(),
  institution: z.string().min(1),
  degree: bilingualTextSchema,
  field: bilingualTextSchema,
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const skillCategorySchema = z.object({
  id: z.string(),
  category: z.string().min(1),
  skills: z.array(z.string()).min(1),
});

export const languageEntrySchema = z.object({
  id: z.string(),
  language: z.string().min(1),
  level: z.string().min(1),
});

export const cvDataSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: bilingualTextSchema,
  experience: z.array(experienceEntrySchema),
  education: z.array(educationEntrySchema),
  skills: z.array(skillCategorySchema),
  languages: z.array(languageEntrySchema),
  language: z.enum(['es', 'en']),
});
