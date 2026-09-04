'use client';

import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import type { CVData } from '@/types/cv';
import { InputCard, ExpandableCard } from '@/components/ui';

export function EducationSectionNew() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CVData>();

  const { fields, append, remove } = useFieldArray({ name: 'education' });
  const educationValues = watch('education');
  const [expandedStates, setExpandedStates] = useState<Record<number, boolean>>({});

  const toggleExpanded = (index: number) => {
    setExpandedStates((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAdd = () => {
    const newIndex = fields.length;
    append({
      id: crypto.randomUUID(),
      institution: '',
      degree: { es: '', en: '' },
      field: { es: '', en: '' },
      startDate: '',
      endDate: '',
    });
    setExpandedStates((prev) => ({ ...prev, [newIndex]: true }));
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => {
        const isExpanded = expandedStates[index] ?? false;
        const eduErrors = errors.education?.[index];

        return (
          <ExpandableCard
            key={field.id}
            title={educationValues[index]?.institution || `Educación ${index + 1}`}
            subtitle={educationValues[index]?.degree?.es || 'Sin título definido'}
            icon="school"
            isExpanded={isExpanded}
            onToggle={() => toggleExpanded(index)}
            onDelete={() => remove(index)}
          >
            <div className="space-y-6">
              {/* Institución */}
              <InputCard
                label="Institución"
                icon="account_balance"
                placeholder="Ej: Universidad de Buenos Aires"
                {...register(`education.${index}.institution`)}
                error={eduErrors?.institution?.message}
              />

              {/* Título ES / EN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputCard
                  label="Título (ES)"
                  placeholder="Ej: Licenciatura en Sistemas"
                  {...register(`education.${index}.degree.es`)}
                  error={eduErrors?.degree?.es?.message}
                />
                <InputCard
                  label="Título (EN)"
                  placeholder="E.g.: Bachelor of Computer Science"
                  {...register(`education.${index}.degree.en`)}
                  error={eduErrors?.degree?.en?.message}
                />
              </div>

              {/* Campo ES / EN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputCard
                  label="Campo de estudio (ES)"
                  placeholder="Ej: Ciencias de la Computación"
                  {...register(`education.${index}.field.es`)}
                  error={eduErrors?.field?.es?.message}
                />
                <InputCard
                  label="Field of study (EN)"
                  placeholder="E.g.: Computer Science"
                  {...register(`education.${index}.field.en`)}
                  error={eduErrors?.field?.en?.message}
                />
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputCard
                  label="Fecha de inicio"
                  icon="calendar_today"
                  placeholder="MM/YYYY"
                  {...register(`education.${index}.startDate`)}
                  error={eduErrors?.startDate?.message}
                />
                <InputCard
                  label="Fecha de fin"
                  icon="calendar_today"
                  placeholder="MM/YYYY"
                  {...register(`education.${index}.endDate`)}
                  error={eduErrors?.endDate?.message}
                />
              </div>
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
        Agregar educación
      </button>
    </div>
  );
}
