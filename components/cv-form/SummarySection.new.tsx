'use client';

import { useFormContext } from 'react-hook-form';
import type { CVData } from '@/types/cv';
import { TextareaCard } from '@/components/ui';

export function SummarySectionNew() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CVData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextareaCard
          label="Resumen en Español"
          placeholder="Describe tu perfil profesional, experiencia clave y objetivos..."
          minHeight="150px"
          {...register('summary.es')}
          error={errors.summary?.es?.message}
        />

        <TextareaCard
          label="Summary in English"
          placeholder="Describe your professional background, key experience and objectives..."
          minHeight="150px"
          {...register('summary.en')}
          error={errors.summary?.en?.message}
        />
      </div>
    </div>
  );
}
