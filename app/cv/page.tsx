'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CVData } from '@/types/cv';
import { cvDataSchema } from '@/lib/cv/schemas';
import { createEmptyCVData } from '@/lib/cv/defaults';
import { loadCVData, saveCVData } from '@/lib/storage';
import { es, en, Dictionary } from '@/lib/i18n/dictionaries';
import {
  PersonalInfoSection,
  SummarySection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  LanguagesSection,
} from '@/components/cv-form';
import { PreviewPanel } from '@/components/cv-preview';

const PdfImporter = dynamic(
  () => import('@/components/cv-form/PdfImporter').then((mod) => mod.PdfImporter),
  { ssr: false }
);

const dictionaries = { es, en };

export default function CVPage() {
  const [mounted, setMounted] = useState(false);
  const [initialData, setInitialData] = useState<CVData>(() => createEmptyCVData());
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<CVData | null>(null);
  const [lang, setLang] = useState<'es' | 'en'>('es');

  useEffect(() => {
    setMounted(true);
    const stored = loadCVData();
    if (stored) {
      setInitialData(stored);
    }
  }, []);

  const methods = useForm<CVData>({
    resolver: zodResolver(cvDataSchema),
    defaultValues: initialData,
  });

  const { handleSubmit, watch, setValue, getValues, formState: { isDirty } } = methods;

  const currentLang = watch('language');
  useEffect(() => {
    if (currentLang) setLang(currentLang);
  }, [currentLang]);

  const dict: Dictionary = dictionaries[lang] || dictionaries.es;

  const onSubmit = (data: CVData) => {
    saveCVData(data);
    setFormData(data);
  };

  const handlePreview = useCallback(() => {
    const data = getValues();
    saveCVData(data);
    setFormData(data);
    setShowPreview(true);
  }, [getValues]);

  useEffect(() => {
    if (!mounted) return;
    const subscription = watch((data) => {
      if (data) saveCVData(data as CVData);
    });
    return () => subscription.unsubscribe();
  }, [watch, mounted]);

  const handleImport = (data: CVData) => {
    Object.entries(data).forEach(([key, value]) => {
      setValue(key as keyof CVData, value);
    });
  };

  if (!mounted) {
    return (
      <div className="bg-pattern min-h-screen flex items-center justify-center">
        <div className="text-on-surface font-headline-md text-2xl animate-pulse">RETRORESUME</div>
      </div>
    );
  }

  return (
    <div className="bg-pattern min-h-screen relative overflow-x-hidden">
      <div className="relative flex h-auto w-full flex-col">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 md:px-10 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1 w-full bg-surface-container rounded-retro retro-border px-4 py-2">
              <header className="flex items-center justify-between whitespace-nowrap px-4 md:px-10 py-3">
                <div className="flex items-center gap-4 text-on-surface">
                  <div className="size-6 text-primary">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path clip-rule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fill-rule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-on-surface text-lg font-bold leading-tight tracking-[-0.015em] font-headline-md">RETRORESUME</h2>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-on-surface-variant font-label-md">
                    {isDirty ? dict.form.saving : dict.form.saved}
                  </span>
                  <select
                    value={lang}
                    onChange={(e) => setValue('language', e.target.value as 'es' | 'en')}
                    className="bg-surface-variant text-on-surface retro-border rounded-full px-3 py-1 text-sm font-label-md"
                  >
                    <option value="es">ES</option>
                    <option value="en">EN</option>
                  </select>
                </div>
              </header>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col gap-8 relative z-10">
        <div className="flex flex-col -space-y-6">
          <div className="rounded bg-surface-container retro-border p-6 mb-4">
            <PdfImporter onImport={handleImport} dict={dict} />
          </div>

          <FormProvider {...methods}>
            <PersonalInfoSection dict={dict} />
            <SummarySection dict={dict} />
            <ExperienceSection dict={dict} />
            <EducationSection dict={dict} />
            <SkillsSection dict={dict} />
            <LanguagesSection dict={dict} />
          </FormProvider>
        </div>

        <div className="flex justify-center pb-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <button
              type="submit"
              className="px-8 py-3 bg-surface-variant text-on-surface font-label-md font-bold rounded-full retro-border hover:bg-surface-bright transition-colors"
            >
              {dict.form.saving}
            </button>
          </form>
        </div>
      </main>

      <button
        onClick={handlePreview}
        className="fixed bottom-8 right-8 z-50 bg-tertiary text-on-tertiary px-6 py-4 rounded-full retro-border flex items-center gap-3 font-headline-md font-bold text-xl uppercase tracking-wider hover:bg-tertiary-fixed-dim transition-transform hover:scale-105 shadow-[6px_6px_0px_0px_#000] cursor-pointer"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm-6 6a6 6 0 0 1 12 0 6 6 0 0 1-12 0zm6-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm-5.5 4A7.5 7.5 0 0 1 12 4.5 7.5 7.5 0 0 1 19.5 12 7.5 7.5 0 0 1 12 19.5 7.5 7.5 0 0 1 4.5 12z" />
        </svg>
        Preview
      </button>

      <PreviewPanel
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        data={formData}
        dict={dict}
      />
    </div>
  );
}
