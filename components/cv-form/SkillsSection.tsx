'use client';

import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CVData } from '@/types/cv';
import { Dictionary } from '@/lib/i18n/dictionaries';

interface Props {
  dict: Dictionary;
}

export function SkillsSection({ dict }: Props) {
  const { register } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({ name: 'skills' });
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="retro-card bg-[#8ccdeb] p-8 text-black relative z-10 -translate-x-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-md text-2xl font-black uppercase tracking-wide flex items-center gap-3">
          <span className="text-3xl">🧠</span>
          {dict.form.skills}
        </h3>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              append({
                id: crypto.randomUUID(),
                category: '',
                skills: [],
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
              <div className="flex flex-col gap-1">
                <label className="font-label-md font-bold text-xs">{dict.fields.category}</label>
                <input {...register(`skills.${index}.category` as const, { required: dict.validation.required })} className="retro-input p-2 w-full text-sm" placeholder="Programming Languages, Frameworks, Tools" />
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <label className="font-label-md font-bold text-xs">{dict.fields.skillList}</label>
                <input {...register(`skills.${index}.skills` as const, { required: dict.validation.required })} className="retro-input p-2 w-full text-sm" placeholder="React, TypeScript, Node.js" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
