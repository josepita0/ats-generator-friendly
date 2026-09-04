'use client';

import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import type { CVData } from '@/types/cv';
import { ExpandableCard, InputCard, SelectCard } from '@/components/ui';

const levelOptions = [
  { value: '', label: 'Seleccionar nivel' },
  { value: 'Nativo', label: 'Nativo' },
  { value: 'C2', label: 'C2 - Maestría' },
  { value: 'C1', label: 'C1 - Avanzado' },
  { value: 'B2', label: 'B2 - Intermedio alto' },
  { value: 'B1', label: 'B1 - Intermedio' },
  { value: 'A2', label: 'A2 - Básico' },
  { value: 'A1', label: 'A1 - Principiante' },
];

export function LanguagesSectionNew() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CVData>();

  const { fields, append, remove } = useFieldArray({ name: 'languages' });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const languages = watch('languages');

  return (
    <div className="space-y-6">
      {fields.map((field, index) => {
        const langErrors = errors.languages?.[index];
        const langData = languages?.[index];
        const language = langData?.language || '';
        const level = langData?.level || '';

        return (
          <ExpandableCard
            key={field.id}
            title={language || 'Nuevo idioma'}
            subtitle={level || 'Sin nivel definido'}
            icon="translate"
            isExpanded={expandedId === field.id}
            onToggle={() => setExpandedId(expandedId === field.id ? null : field.id)}
            onDelete={() => remove(index)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputCard
                label="Idioma"
                icon="translate"
                placeholder="Ej: Inglés, Español, Portugués"
                {...register(`languages.${index}.language`)}
                error={langErrors?.language?.message}
              />
              <SelectCard
                label="Nivel"
                options={levelOptions}
                {...register(`languages.${index}.level`)}
                error={langErrors?.level?.message}
              />
            </div>
          </ExpandableCard>
        );
      })}

      {/* Botón agregar */}
      <button
        type="button"
        onClick={() =>
          append({
            id: crypto.randomUUID(),
            language: '',
            level: '',
          })
        }
        className="
          w-full py-4
          border-2 border-dashed border-outline-variant/40
          rounded-2xl
          font-label-md text-label-md text-on-surface-variant
          hover:border-primary hover:text-primary hover:bg-primary-container/5
          transition-all duration-200
          flex items-center justify-center gap-2
          cursor-pointer
        "
      >
        <span className="material-symbols-outlined text-[20px]">add</span>
        Agregar idioma
      </button>
    </div>
  );
}
