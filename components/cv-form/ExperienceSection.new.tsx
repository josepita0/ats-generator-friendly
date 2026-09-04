'use client';

import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import type { CVData } from '@/types/cv';
import { InputCard, TextareaCard, ExpandableCard } from '@/components/ui';

export function ExperienceSectionNew() {
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
            title={expData?.company || `Experiencia ${index + 1}`}
            subtitle={expData?.position?.es || 'Sin puesto definido'}
            icon="work"
            isExpanded={isExpanded}
            onToggle={() => toggleExpanded(index)}
            onDelete={() => remove(index)}
          >
            <div className="space-y-4">
              {/* Empresa */}
              <InputCard
                label="Empresa"
                icon="business"
                placeholder="Ej: Google, Mercado Libre"
                {...register(`experience.${index}.company`)}
                error={expErrors?.company?.message}
              />

              {/* Puesto ES / EN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputCard
                  label="Puesto (ES)"
                  placeholder="Ej: Senior Frontend Developer"
                  {...register(`experience.${index}.position.es`)}
                  error={expErrors?.position?.es?.message}
                />
                <InputCard
                  label="Puesto (EN)"
                  placeholder="Ej: Senior Frontend Developer"
                  {...register(`experience.${index}.position.en`)}
                  error={expErrors?.position?.en?.message}
                />
              </div>

              {/* Ubicación / Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputCard
                  label="Ubicación"
                  icon="location_on"
                  placeholder="Ej: Buenos Aires, Argentina"
                  {...register(`experience.${index}.location`)}
                  error={expErrors?.location?.message}
                />
                <InputCard
                  label="Fecha de inicio"
                  icon="calendar_today"
                  placeholder="MM/YYYY"
                  {...register(`experience.${index}.startDate`)}
                  error={expErrors?.startDate?.message}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputCard
                  label="Fecha de fin"
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
                      Trabajo aquí actualmente
                    </span>
                  </label>
                </div>
              </div>

              {/* Descripción ES / EN */}
              <TextareaCard
                label="Descripción (ES)"
                placeholder="Describe tus responsabilidades y logros cuantificables..."
                minHeight="100px"
                {...register(`experience.${index}.descriptions.es`)}
                error={expErrors?.descriptions?.es?.message}
              />

              <TextareaCard
                label="Description (EN)"
                placeholder="Describe your responsibilities and quantifiable achievements..."
                minHeight="100px"
                {...register(`experience.${index}.descriptions.en`)}
                error={expErrors?.descriptions?.en?.message}
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
        Agregar experiencia
      </button>
    </div>
  );
}
