'use client';

import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import type { CVData } from '@/types/cv';
import { InputCard, ExpandableCard } from '@/components/ui';

interface Props {
  lang: 'es' | 'en';
}

export function EducationSectionNew({ lang }: Props) {
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
            title={educationValues[index]?.institution || (lang === 'es' ? `Educación ${index + 1}` : `Education ${index + 1}`)}
            subtitle={educationValues[index]?.degree?.[lang] || (lang === 'es' ? 'Sin título definido' : 'No degree defined')}
            icon="school"
            isExpanded={isExpanded}
            onToggle={() => toggleExpanded(index)}
            onDelete={() => remove(index)}
          >
            <div className="space-y-6">
              {/* Institución */}
              <InputCard
                label={lang === 'es' ? 'Institución' : 'Institution'}
                icon="account_balance"
                placeholder={lang === 'es' ? 'Ej: Universidad de Buenos Aires' : 'E.g.: Harvard University'}
                {...register(`education.${index}.institution`)}
                error={eduErrors?.institution?.message}
              />

              {/* Título */}
              <InputCard
                label={lang === 'es' ? 'Título' : 'Degree'}
                placeholder={lang === 'es' ? 'Ej: Licenciatura en Sistemas' : 'E.g.: Bachelor of Computer Science'}
                {...register(`education.${index}.degree.${lang}`)}
                error={eduErrors?.degree?.[lang]?.message}
              />

              {/* Campo de estudio */}
              <InputCard
                label={lang === 'es' ? 'Campo de estudio' : 'Field of Study'}
                placeholder={lang === 'es' ? 'Ej: Ciencias de la Computación' : 'E.g.: Computer Science'}
                {...register(`education.${index}.field.${lang}`)}
                error={eduErrors?.field?.[lang]?.message}
              />

              {/* Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputCard
                  label={lang === 'es' ? 'Fecha de inicio' : 'Start Date'}
                  icon="calendar_today"
                  placeholder="MM/YYYY"
                  {...register(`education.${index}.startDate`)}
                  error={eduErrors?.startDate?.message}
                />
                <InputCard
                  label={lang === 'es' ? 'Fecha de fin' : 'End Date'}
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
        {lang === 'es' ? 'Agregar educación' : 'Add education'}
      </button>
    </div>
  );
}
