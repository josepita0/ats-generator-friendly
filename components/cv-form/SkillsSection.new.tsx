'use client';

import { useState } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import type { CVData } from '@/types/cv';
import { InputCard, ChipInput, ExpandableCard } from '@/components/ui';

export function SkillsSectionNew() {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext<CVData>();

  const { fields, append, remove } = useFieldArray({ name: 'skills' });
  const skillsValues = watch('skills');
  const [expandedStates, setExpandedStates] = useState<Record<number, boolean>>({});

  const toggleExpanded = (index: number) => {
    setExpandedStates((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAdd = () => {
    const newIndex = fields.length;
    append({
      id: crypto.randomUUID(),
      category: '',
      skills: [],
    });
    setExpandedStates((prev) => ({ ...prev, [newIndex]: true }));
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => {
        const isExpanded = expandedStates[index] ?? false;
        const skillErrors = errors.skills?.[index];

        return (
          <ExpandableCard
            key={field.id}
            title={skillsValues[index]?.category || `Categoría ${index + 1}`}
            subtitle={skillsValues[index]?.skills?.length ? `${skillsValues[index].skills.length} habilidades` : 'Sin habilidades'}
            icon="code_blocks"
            isExpanded={isExpanded}
            onToggle={() => toggleExpanded(index)}
            onDelete={() => remove(index)}
          >
            <div className="space-y-6">
              {/* Categoría */}
              <InputCard
                label="Categoría"
                icon="label"
                placeholder="Ej: Lenguajes de programación, Frameworks, Herramientas"
                {...register(`skills.${index}.category`)}
                error={skillErrors?.category?.message}
              />

              {/* Skills como chips */}
              <Controller
                name={`skills.${index}.skills`}
                control={control}
                render={({ field }) => (
                  <ChipInput
                    label="Habilidades"
                    values={field.value || []}
                    onChange={field.onChange}
                    placeholder="Escribe y presiona Enter para agregar"
                    error={skillErrors?.skills?.message}
                  />
                )}
              />
            </div>
          </ExpandableCard>
        );
      })}

      {/* Botón agregar */}
      <button
        type="button"
        onClick={handleAdd}
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
        Agregar categoría
      </button>
    </div>
  );
}
