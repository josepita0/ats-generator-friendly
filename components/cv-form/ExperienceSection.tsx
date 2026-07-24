'use client';

import { useState } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { CVData } from '@/types/cv';
import { Dictionary } from '@/lib/i18n/dictionaries';
import { MonthYearPicker } from './MonthYearPicker';

interface Props {
  dict: Dictionary;
}

export function ExperienceSection({ dict }: Props) {
  const { register, control } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({ name: 'experience' });
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="retro-card bg-[#fca851] p-8 text-black relative z-30 -translate-x-1">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-md text-2xl font-black uppercase tracking-wide flex items-center gap-3">
          <span className="text-3xl">💼</span>
          {dict.form.experience}
        </h3>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              append({
                id: crypto.randomUUID(),
                company: '',
                position: { es: '', en: '' },
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                descriptions: { es: '', en: '' },
              })
            }
            className="bg-black text-white px-4 py-2 rounded-full font-label-md font-bold border-2 border-black hover:bg-white hover:text-black transition-colors flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            {dict.form.add}
          </button>
          <button type="button" onClick={() => setCollapsed(!collapsed)} className="cursor-pointer hover:scale-110 transition-transform">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={collapsed ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
            </svg>
          </button>
        </div>
      </div>
      {!collapsed && (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="retro-border rounded-xl bg-white/60 p-4 relative">
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 text-red-700 hover:text-red-900 font-bold text-sm bg-white/80 rounded-full px-2 retro-border"
              >
                ✕
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md font-bold text-xs">{dict.fields.company}</label>
                  <input {...register(`experience.${index}.company` as const, { required: dict.validation.required })} className="retro-input p-2 w-full text-sm" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md font-bold text-xs">{dict.fields.location}</label>
                  <input {...register(`experience.${index}.location` as const)} className="retro-input p-2 w-full text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md font-bold text-xs">{dict.fields.position} (ES)</label>
                  <input {...register(`experience.${index}.position.es` as const, { required: dict.validation.required })} className="retro-input p-2 w-full text-sm" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md font-bold text-xs">{dict.fields.position} (EN)</label>
                  <input {...register(`experience.${index}.position.en` as const)} className="retro-input p-2 w-full text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md font-bold text-xs">{dict.fields.startDate}</label>
                  <Controller
                    control={control}
                    name={`experience.${index}.startDate` as const}
                    rules={{ required: dict.validation.required }}
                    render={({ field }) => (
                      <MonthYearPicker
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md font-bold text-xs">{dict.fields.endDate}</label>
                  <Controller
                    control={control}
                    name={`experience.${index}.endDate` as const}
                    render={({ field }) => (
                      <MonthYearPicker
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    )}
                  />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input type="checkbox" id={`current-${field.id}`} {...register(`experience.${index}.current` as const)} className="h-4 w-4" />
                  <label htmlFor={`current-${field.id}`} className="font-label-md font-bold text-xs">{dict.form.current}</label>
                </div>
              </div>
              <div className="mt-2">
                <label className="font-label-md font-bold text-xs">{dict.fields.descriptions} (ES)</label>
                <textarea {...register(`experience.${index}.descriptions.es` as const)} rows={2} className="retro-input p-2 w-full text-sm resize-none mt-1" />
              </div>
              <div className="mt-2">
                <label className="font-label-md font-bold text-xs">{dict.fields.descriptions} (EN)</label>
                <textarea {...register(`experience.${index}.descriptions.en` as const)} rows={2} className="retro-input p-2 w-full text-sm resize-none mt-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
