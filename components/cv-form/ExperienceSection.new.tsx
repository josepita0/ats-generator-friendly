'use client';

import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import type { CVData } from '@/types/cv';
import { InputCard, TextareaCard, ExpandableCard } from '@/components/ui';

interface Props {
  lang: 'es' | 'en';
}

export function ExperienceSectionNew({ lang }: Props) {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext<CVData>();

  const { fields, append, remove } = useFieldArray({ name: 'experience' });
  const experienceValues = watch('experience');
  const [expandedStates, setExpandedStates] = useState<Record<number, boolean>>({});

  const toggleExpanded = (index: number) => {
    setExpandedStates((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAdd = () => {
    const newIndex = fields.length;
    append({
      id: crypto.randomUUID(),
      company: '',
      position: { es: '', en: '' },
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      descriptions: { es: '', en: '' },
    });
    setExpandedStates((prev) => ({ ...prev, [newIndex]: true }));
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => {
        const isExpanded = expandedStates[index] ?? false;
        const expErrors = errors.experience?.[index];
        const expData = experienceValues[index];

        return (
          <ExpandableCard
            key={field.id}
            title={expData?.company || (lang === 'es' ? `Experiencia ${index + 1}` : `Experience ${index + 1}`)}
            subtitle={expData?.position?.[lang] || (lang === 'es' ? 'Sin puesto definido' : 'No position defined')}
            icon="work"
            isExpanded={isExpanded}
            onToggle={() => toggleExpanded(index)}
            onDelete={() => remove(index)}
          >
            <div className="space-y-4">
              {/* Empresa */}
              <InputCard
                label={lang === 'es' ? 'Empresa' : 'Company'}
                icon="business"
                placeholder={lang === 'es' ? 'Ej: Google, Mercado Libre' : 'E.g.: Google, Microsoft'}
                {...register(`experience.${index}.company`)}
                error={expErrors?.company?.message}
              />

              {/* Puesto */}
              <InputCard
                label={lang === 'es' ? 'Puesto' : 'Position'}
                placeholder={lang === 'es' ? 'Ej: Senior Frontend Developer' : 'E.g.: Senior Frontend Developer'}
                {...register(`experience.${index}.position.${lang}`)}
                error={expErrors?.position?.[lang]?.message}
              />

              {/* Ubicación / Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputCard
                  label={lang === 'es' ? 'Ubicación' : 'Location'}
                  icon="location_on"
                  placeholder={lang === 'es' ? 'Ej: Buenos Aires, Argentina' : 'E.g.: San Francisco, CA'}
                  {...register(`experience.${index}.location`)}
                  error={expErrors?.location?.message}
                />
                <InputCard
                  label={lang === 'es' ? 'Fecha de inicio' : 'Start Date'}
                  icon="calendar_today"
                  placeholder="MM/YYYY"
                  {...register(`experience.${index}.startDate`)}
                  error={expErrors?.startDate?.message}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputCard
                  label={lang === 'es' ? 'Fecha de fin' : 'End Date'}
                  icon="calendar_today"
                  placeholder="MM/YYYY"
                  disabled={false}
                  {...register(`experience.${index}.endDate`)}
                  error={expErrors?.endDate?.message}
                />
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register(`experience.${index}.current`)}
                      className="w-5 h-5 rounded-lg border-outline-variant/60 text-primary focus:ring-primary accent-primary cursor-pointer"
                    />
                    <span className="font-body-md text-body-md text-on-surface">
                      {lang === 'es' ? 'Trabajo aquí actualmente' : 'I currently work here'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Descripción */}
              <TextareaCard
                label={lang === 'es' ? 'Descripción' : 'Description'}
                placeholder={lang === 'es'
                  ? 'Describe tus responsabilidades y logros cuantificables...'
                  : 'Describe your responsibilities and quantifiable achievements...'
                }
                minHeight="150px"
                {...register(`experience.${index}.descriptions.${lang}`)}
                error={expErrors?.descriptions?.[lang]?.message}
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
          w-full py-3
          border-2 border-dashed border-outline-variant/40
          rounded-xl
          font-label-sm text-label-sm text-on-surface-variant
          hover:border-primary hover:text-primary hover:bg-primary-container/5
          transition-all duration-200
          flex items-center justify-center gap-1.5
          cursor-pointer
        "
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        {lang === 'es' ? 'Agregar experiencia' : 'Add experience'}
      </button>
    </div>
  );
}
