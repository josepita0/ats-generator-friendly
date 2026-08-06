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
import { loadCVData, saveCVData, loadCoverLetter } from "@/lib/storage";
import { ChatSection } from "@/components/chat";
import { CoverLetterSection, CoverLetterPreview } from "@/components/cover-letter";
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

type MobileTab = "editor" | "generate";

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
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [generateSubTab, setGenerateSubTab] = useState<"pdf" | "cover-letter">("pdf");
  const [coverLetterVersion, setCoverLetterVersion] = useState(0);

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
              {dict.expandAll}
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {dict.collapseAll}
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

  const renderGenerateContent = () => (
    <div className="flex flex-col gap-4">
      <div className="chat-panel-tabs">
        <button
          type="button"
          onClick={() => setGenerateSubTab("pdf")}
          className={`chat-panel-tab ${generateSubTab === "pdf" ? "active" : ""}`}
        >
          {dict.livePreview}
        </button>
        <button
          type="button"
          onClick={() => { setGenerateSubTab("cover-letter"); setCoverLetterVersion(v => v + 1); }}
          className={`chat-panel-tab ${generateSubTab === "cover-letter" ? "active" : ""}`}
        >
          {dict.coverLetter.title}
        </button>
      </div>

      {generateSubTab === "pdf" && (
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded overflow-hidden max-h-[60vh] overflow-y-auto shadow-[4px_4px_0_#06132E] border-2 border-[#06132E]">
            <CVPreview data={getValues()} dict={dict} />
          </div>
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="px-btn-yellow w-full flex items-center justify-center h-[56px]"
          >
            {dict.form.downloadPdf}
          </button>
        </div>
      )}

      {generateSubTab === "cover-letter" && (
        <div className="flex flex-col gap-4" key={coverLetterVersion}>
          <CoverLetterSection
            dict={dict}
            getCvData={() => getValues()}
            jobDescription={jobDescription}
            language={lang}
            compact
          />
          {(() => {
            const letter = loadCoverLetter();
            const body = lang === 'es' ? letter?.es : letter?.en;
            if (body) {
              return (
                <div className="bg-white rounded overflow-hidden max-h-[50vh] overflow-y-auto shadow-[4px_4px_0_#06132E] border-2 border-[#06132E]">
                  <CoverLetterPreview
                    personalInfo={getValues().personalInfo}
                    body={body}
                    language={lang}
                  />
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}
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
              {dict.expandAll}
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        {dict.collapseAll}
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

      {/* Floating AI button - mobile only */}
      <button
        type="button"
        onClick={() => setShowChatPanel(true)}
        className="floating-ai-btn flex lg:hidden"
        aria-label="Open AI Assistant"
      >
        <svg className="w-6 h-6 text-[#FFC329]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 110 2h-1v1a7 7 0 01-7 7H9a7 7 0 01-7-7v-1H1a1 1 0 110-2h1v-1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM8 11a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z" />
        </svg>
      </button>

      {/* Chat panel - bottom sheet on mobile */}
      <div
        className={`chat-overlay lg:hidden ${!showChatPanel ? 'closed' : ''}`}
        onClick={() => setShowChatPanel(false)}
      />
      <div className={`chat-panel flex lg:hidden ${!showChatPanel ? 'closed' : ''}`}>
        <div className="chat-panel-header">
          <span
            className="text-[#FFF3D5] uppercase tracking-wider font-headline-md"
            style={{ fontSize: "0.5rem" }}
          >
            {dict.chat.title}
          </span>
          <button
            type="button"
            onClick={() => setShowChatPanel(false)}
            className="chat-panel-close"
            aria-label="Close panel"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="chat-panel-body">
          <div className="flex items-start gap-3">
            <div className="px-badge-robot shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-[#06132E]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 110 2h-1v1a7 7 0 01-7 7H9a7 7 0 01-7-7v-1H1a1 1 0 110-2h1v-1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM8 11a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
            </div>
            <div className="px-speech-bubble flex-1">
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}>
                {dict.aiGreeting}
              </p>
            </div>
          </div>

          <div className="text-[#FFF3D5] text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
            {dict.chat.emptyHint}
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
