"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CVData } from "@/types/cv";
import { Suggestion } from "@/types/chat";
import { cvDataSchema } from "@/lib/cv/schemas";
import { createEmptyCVData } from "@/lib/cv/defaults";
import { replaceBulletInDescriptions } from "@/lib/cv/descriptions";
import { loadCVData, saveCVData } from "@/lib/storage";
import { ChatSection } from "@/components/chat";
import { CoverLetterSection } from "@/components/cover-letter";
import { es, en, Dictionary } from "@/lib/i18n/dictionaries";
import {
  PersonalInfoSection,
  SummarySection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  LanguagesSection,
} from "@/components/cv-form";
import { AppHeader } from "@/components/cv-form/AppHeader";
import { PreviewPanel } from "@/components/cv-preview";
import { SidebarPanel } from "@/components/cv-preview/SidebarPanel";

const PdfImporter = dynamic(
  () =>
    import("@/components/cv-form/PdfImporter").then((mod) => mod.PdfImporter),
  { ssr: false },
);

const TranslateButton = dynamic(
  () =>
    import("@/components/cv-form/TranslateButton").then(
      (mod) => mod.TranslateButton,
    ),
  { ssr: false },
);

const dictionaries = { es, en };

function normalizeDates(data: CVData): CVData {
  return {
    ...data,
    experience: data.experience.map((exp) => ({
      ...exp,
      endDate: exp.endDate || exp.startDate || "",
      startDate: exp.startDate && !exp.endDate ? "" : exp.startDate || "",
    })),
    education: data.education.map((edu) => ({
      ...edu,
      endDate: edu.endDate || edu.startDate || "",
      startDate: edu.startDate && !edu.endDate ? "" : edu.startDate || "",
    })),
  };
}

export default function CVPage() {
  const [mounted, setMounted] = useState(false);
  const [initialData, setInitialData] = useState<CVData>(() =>
    createEmptyCVData(),
  );
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<CVData | null>(null);
  const [lang, setLang] = useState<"es" | "en">("es");
  const [jobDescription, setJobDescription] = useState("");

  const methods = useForm<CVData>({
    resolver: zodResolver(cvDataSchema),
    values: initialData,
  });

  const { handleSubmit, watch, setValue, getValues } = methods;

  useEffect(() => {
    setMounted(true);
    const stored = loadCVData();
    if (stored) {
      const normalized = normalizeDates(stored);
      setInitialData(normalized);
    }
  }, []);

  const currentLang = watch("language");
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
    const normalized = replaceBulletInDescriptions(data);
    Object.entries(normalized).forEach(([key, value]) => {
      setValue(key as keyof CVData, value);
    });
  };

  const handleTranslate = (data: CVData) => {
    const normalized = replaceBulletInDescriptions(data);
    Object.entries(normalized).forEach(([key, value]) => {
      setValue(key as keyof CVData, value);
    });
  };

  const handleApplyChatSuggestion = (
    _suggestion: Suggestion,
    updatedCv: CVData,
  ) => {
    Object.entries(updatedCv).forEach(([key, value]) => {
      setValue(key as keyof CVData, value);
    });
    saveCVData(updatedCv);
  };

  if (!mounted) {
    return (
      <div className="bg-pattern min-h-screen flex items-center justify-center">
        <div
          className="text-[#FFC329] font-headline-md animate-pulse"
          style={{ fontSize: "0.7rem", textShadow: "2px 2px 0 #06132E" }}
        >
          RETRORESUME
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pattern min-h-screen relative overflow-x-hidden">
      <div className="max-w-[1280px] mx-auto p-5">
        <div className="pixel-border-orange bg-[#071539]">
          <AppHeader
            importSlot={
              <PdfImporter onImport={handleImport} dict={dict} compact />
            }
            translateSlot={
              <TranslateButton
                onTranslate={handleTranslate}
                dict={dict}
                getCvData={() => getValues()}
                compact
              />
            }
          />

          <div className="p-5 grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-5">
            <div className="pixel-panel  rounded-[10px] p-4 max-h-[calc(100vh-180px)] overflow-y-auto px-scroll flex flex-col gap-4">
              <FormProvider {...methods}>
                <PersonalInfoSection dict={dict} />
                <SummarySection dict={dict} />
                <ExperienceSection dict={dict} />
                <EducationSection dict={dict} />
                <SkillsSection dict={dict} />
                <LanguagesSection dict={dict} />
              </FormProvider>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex justify-center pt-2 pb-1"
              >
                <button
                  type="submit"
                  className="px-btn-teal flex items-center gap-2 py-2 px-8"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  {dict.form.saving}
                </button>
              </form>
            </div>

            <SidebarPanel
              onPreviewClick={handlePreview}
              lang={lang}
              onLangChange={(l) => setValue("language", l)}
              chatSlot={
                <ChatSection
                  dict={dict}
                  getCvData={() => getValues()}
                  onApplySuggestion={handleApplyChatSuggestion}
                  language={lang}
                  jobDescription={jobDescription}
                  onJobDescriptionChange={setJobDescription}
                  compact
                />
              }
              coverSlot={
                <CoverLetterSection
                  dict={dict}
                  getCvData={() => getValues()}
                  jobDescription={jobDescription}
                  language={lang}
                  compact
                />
              }
            />
          </div>
        </div>
      </div>

      <PreviewPanel
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        data={formData}
        dict={dict}
      />
    </div>
  );
}
