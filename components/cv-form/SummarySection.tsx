'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CVData } from '@/types/cv';
import { Dictionary } from '@/lib/i18n/dictionaries';

interface Props {
  dict: Dictionary;
}

export function SummarySection({ dict }: Props) {
  const { register } = useFormContext<CVData>();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="retro-card bg-[#f7e068] p-8 text-black relative z-40 translate-x-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-md text-2xl font-black uppercase tracking-wide flex items-center gap-3">
          <span className="text-3xl">✏️</span>
          {dict.form.summary}
        </h3>
        <button type="button" onClick={() => setCollapsed(!collapsed)} className="cursor-pointer hover:scale-110 transition-transform">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={collapsed ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
          </svg>
        </button>
      </div>
      {!collapsed && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-label-md font-bold text-sm">{dict.fields.summaryEs}</label>
            <textarea {...register('summary.es', { required: dict.validation.required })} rows={3} className="retro-input p-3 w-full resize-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md font-bold text-sm">{dict.fields.summaryEn}</label>
            <textarea {...register('summary.en')} rows={3} className="retro-input p-3 w-full resize-none" />
          </div>
        </div>
      )}
    </div>
  );
}
