'use client';

import { useFormContext } from 'react-hook-form';
import type { CVData } from '@/types/cv';
import { TextareaCard } from '@/components/ui';

interface Props {
  lang: 'es' | 'en';
}

export function SummarySectionNew({ lang }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CVData>();

  return (
    <div className="space-y-6">
      <TextareaCard
        label={lang === 'es' ? 'Resumen Profesional' : 'Professional Summary'}
        placeholder={lang === 'es' 
          ? 'Describe tu perfil profesional, experiencia clave y objetivos...'
          : 'Describe your professional background, key experience and objectives...'
        }
        minHeight="200px"
        {...register(`summary.${lang}`)}
        error={errors.summary?.[lang]?.message}
      />
    </div>
  );
}
