"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pdf } from "@react-pdf/renderer";
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
import { PreviewPanel, CVPreview } from "@/components/cv-preview";
import { SidebarPanel } from "@/components/cv-preview/SidebarPanel";
import { CVDocument } from "@/components/pdf";

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

type MobileTab = "editor" | "ai-preview" | "generate";

export default function CVPage() {
  const [mounted, setMounted] = useState(false);
  const [initialData, setInitialData] = useState<CVData>(() =>
    createEmptyCVData(),
  );
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<CVData | null>(null);
  const [lang, setLang] = useState<"es" | "en">("es");
  const [jobDescription, setJobDescription] = useState("");
  const [activeTab, setActiveTab] = useState<MobileTab>("editor");
  const [collapseAll, setCollapseAll] = useState<boolean | null>(null);

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

  const handleDownloadPDF = useCallback(async () => {
    const data = getValues();
    saveCVData(data);
    setFormData(data);
    const blob = await pdf(<CVDocument data={data} dict={dict} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${data.personalInfo.name.replace(/\s+/g, "_")}_CV.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [getValues, dict]);

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

  const renderEditorContent = () => (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setCollapseAll(collapseAll ? null : true)}
          className="px-btn-small bg-surface-variant text-[#FFF3D5] flex items-center gap-1"
        >
          {collapseAll ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Expand All
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Collapse All
            </>
          )}
        </button>
      </div>
      <FormProvider {...methods}>
        <PersonalInfoSection dict={dict} forceCollapsed={collapseAll} />
        <SummarySection dict={dict} forceCollapsed={collapseAll} />
        <ExperienceSection dict={dict} forceCollapsed={collapseAll} />
        <EducationSection dict={dict} forceCollapsed={collapseAll} />
        <SkillsSection dict={dict} forceCollapsed={collapseAll} />
        <LanguagesSection dict={dict} forceCollapsed={collapseAll} />
      </FormProvider>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-center pt-1 pb-1"
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
  );

  const renderAiPreviewContent = () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span
          className="text-[#FFF3D5] uppercase tracking-wider font-headline-md"
          style={{ fontSize: "0.5rem" }}
        >
          AI ASSISTANT & PREVIEW
        </span>
        <select
          value={lang}
          onChange={(e) => setValue("language", e.target.value as "es" | "en")}
          className="px-input w-auto text-xs py-1 px-2"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
          }}
        >
          <option value="es">ES</option>
          <option value="en">EN</option>
        </select>
      </div>

      <div className="flex items-start gap-3">
        <div className="px-badge-robot shrink-0 mt-0.5">
          <svg
            className="w-4 h-4 text-[#06132E]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 110 2h-1v1a7 7 0 01-7 7H9a7 7 0 01-7-7v-1H1a1 1 0 110-2h1v-1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM8 11a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z" />
          </svg>
        </div>
        <div className="px-speech-bubble flex-1">
          <p
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}
          >
            Let&apos;s optimize your resume for ATS!
          </p>
        </div>
      </div>

      <div
        className="text-[#FFF3D5] text-xs"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {lang === "es"
          ? "Pega una oferta de trabajo y pídeme que adapte tu CV."
          : "Paste a job description and ask me to adapt your CV."}
      </div>

      <ChatSection
        dict={dict}
        getCvData={() => getValues()}
        onApplySuggestion={handleApplyChatSuggestion}
        language={lang}
        jobDescription={jobDescription}
        onJobDescriptionChange={setJobDescription}
        compact
      />

      <div className="border-t border-[#2AB7C9]/30 pt-4">
        <CoverLetterSection
          dict={dict}
          getCvData={() => getValues()}
          jobDescription={jobDescription}
          language={lang}
          compact
        />
      </div>

      <div className="border-t border-[#2AB7C9]/30 pt-4">
        <div className="flex items-center gap-2 mb-2">
          <svg
            className="w-4 h-4 text-[#FFF3D5]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.586-5.586A1 1 0 0012.914 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <span
            className="text-[#FFF3D5] uppercase tracking-wider font-headline-md"
            style={{ fontSize: "0.5rem" }}
          >
            LIVE PREVIEW
          </span>
        </div>
        <button
          type="button"
          onClick={handlePreview}
          className="px-preview-thumb w-full text-left"
        >
          <div className="flex min-h-[120px] bg-[#FFF3D5] rounded overflow-hidden relative">
            <div className="w-3 bg-[#0E4A57] shrink-0" />
            <div className="flex-1 p-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-[#FFC329] border border-[#06132E]" />
                <div>
                  <div className="h-1.5 bg-[#06132E] rounded w-14 mb-0.5" />
                  <div className="h-1 bg-[#3B2E67] rounded w-10" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="h-0.5 bg-[#0E4A57]/40 rounded w-full" />
                <div className="h-1 bg-[#06132E]/60 rounded w-3/4" />
                <div className="h-1 bg-[#06132E]/60 rounded w-2/3" />
                <div className="h-1 bg-[#06132E]/60 rounded w-5/6" />
                <div className="h-1 bg-[#06132E]/60 rounded w-1/2" />
                <div className="h-0.5 bg-[#0E4A57]/40 rounded w-full" />
                <div className="h-1 bg-[#06132E]/60 rounded w-3/4" />
                <div className="h-1 bg-[#06132E]/60 rounded w-2/3" />
              </div>
            </div>
          </div>
        </button>
      </div>

      <button
        type="button"
        onClick={handlePreview}
        className="px-btn-yellow w-full flex flex-col items-center justify-center h-[64px]"
      >
        <span>GENERATE &</span>
        <span>DOWNLOAD PDF</span>
      </button>
    </div>
  );

  const renderGenerateContent = () => (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded overflow-hidden max-h-[60vh] overflow-y-auto shadow-[4px_4px_0_#06132E] border-2 border-[#06132E]">
        <CVPreview data={getValues()} dict={dict} />
      </div>
      <button
        type="button"
        onClick={handleDownloadPDF}
        className="px-btn-yellow w-full flex flex-col items-center justify-center h-[64px]"
      >
        <span>GENERATE &</span>
        <span>DOWNLOAD PDF</span>
      </button>
    </div>
  );

  return (
    <div className="bg-pattern min-h-screen relative overflow-x-hidden">
      {/* Mobile header */}
      <div className="lg:hidden">
        <AppHeader
          mobile
          importSlot={
            <PdfImporter onImport={handleImport} dict={dict} mobile />
          }
          translateSlot={
            <TranslateButton
              onTranslate={handleTranslate}
              dict={dict}
              getCvData={() => getValues()}
              mobile
            />
          }
        />
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:block">
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
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCollapseAll(collapseAll ? null : true)}
                    className="px-btn-small bg-surface-variant text-[#FFF3D5] flex items-center gap-1"
                  >
                    {collapseAll ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        Expand All
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Collapse All
                      </>
                    )}
                  </button>
                </div>
                <FormProvider {...methods}>
                  <PersonalInfoSection dict={dict} forceCollapsed={collapseAll} />
                  <SummarySection dict={dict} forceCollapsed={collapseAll} />
                  <ExperienceSection dict={dict} forceCollapsed={collapseAll} />
                  <EducationSection dict={dict} forceCollapsed={collapseAll} />
                  <SkillsSection dict={dict} forceCollapsed={collapseAll} />
                  <LanguagesSection dict={dict} forceCollapsed={collapseAll} />
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
      </div>

      {/* Mobile content */}
      <div className="lg:hidden p-3 pb-[72px]">
        {activeTab === "editor" && renderEditorContent()}
        {activeTab === "ai-preview" && renderAiPreviewContent()}
        {activeTab === "generate" && renderGenerateContent()}
      </div>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav flex lg:hidden">
        <button
          type="button"
          onClick={() => setActiveTab("editor")}
          className={`bottom-nav-tab ${activeTab === "editor" ? "active" : ""}`}
        >
          <svg
            className="bottom-nav-tab-icon w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          <span className="bottom-nav-tab-label">Editor</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ai-preview")}
          className={`bottom-nav-tab ${activeTab === "ai-preview" ? "active" : ""}`}
        >
          <svg
            className="bottom-nav-tab-icon w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="bottom-nav-tab-label">AI &amp; Preview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("generate")}
          className={`bottom-nav-tab ${activeTab === "generate" ? "active" : ""}`}
        >
          <svg
            className="bottom-nav-tab-icon w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span className="bottom-nav-tab-label">Generate</span>
        </button>
      </nav>

      <PreviewPanel
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        data={formData}
        dict={dict}
      />
    </div>
  );
}
