'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CVData } from '@/types/cv';
import { Dictionary } from '@/lib/i18n/dictionaries';

interface Props {
  dict: Dictionary;
}

export function PersonalInfoSection({ dict }: Props) {
  const { register, formState: { errors: formErrors } } = useFormContext<CVData>();
  const e = formErrors.personalInfo;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="retro-card bg-[#d8b4e2] p-8 text-black relative z-50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-md text-2xl font-black uppercase tracking-wide flex items-center gap-3">
          <span className="text-3xl">👤</span>
          {dict.form.personalInfo}
        </h3>
        <button type="button" onClick={() => setCollapsed(!collapsed)} className="cursor-pointer hover:scale-110 transition-transform">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={collapsed ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
          </svg>
        </button>
      </div>
      {!collapsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-label-md font-bold text-sm">{dict.fields.name}</label>
            <input {...register('personalInfo.name', { required: dict.validation.required })} className="retro-input p-3 w-full" />
            {e?.name && <p className="text-xs text-red-700 font-bold">{e.name.message as string}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md font-bold text-sm">{dict.fields.email}</label>
            <input type="email" {...register('personalInfo.email', { required: dict.validation.required })} className="retro-input p-3 w-full" />
            {e?.email && <p className="text-xs text-red-700 font-bold">{e.email.message as string}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md font-bold text-sm">{dict.fields.phone}</label>
            <input {...register('personalInfo.phone', { required: dict.validation.required })} className="retro-input p-3 w-full" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md font-bold text-sm">{dict.fields.location}</label>
            <input {...register('personalInfo.location', { required: dict.validation.required })} className="retro-input p-3 w-full" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md font-bold text-sm">{dict.fields.linkedin}</label>
            <input {...register('personalInfo.linkedin')} className="retro-input p-3 w-full" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md font-bold text-sm">{dict.fields.website}</label>
            <input {...register('personalInfo.website')} className="retro-input p-3 w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
