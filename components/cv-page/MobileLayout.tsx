"use client";

import dynamic from "next/dynamic";
import { UseFormReturn } from "react-hook-form";
import { CVData } from "@/types/cv";
import { Dictionary } from "@/lib/i18n/dictionaries";
import { AppHeader } from "@/components/cv-form/AppHeader";
import { EditorContent } from "./EditorContent";
import { GenerateContent } from "./GenerateContent";
import type { MobileTab } from "@/hooks/useCVForm";

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

interface Props {
  dict: Dictionary;
  methods: UseFormReturn<CVData>;
  handleSubmit: UseFormReturn<CVData>["handleSubmit"];
  onSubmit: (data: CVData) => void;
  collapseAll: boolean | null;
  setCollapseAll: React.Dispatch<React.SetStateAction<boolean | null>>;
  handleApplyCvData: (data: CVData) => void;
  handleDownloadPDF: () => void;
  getValues: UseFormReturn<CVData>["getValues"];
  lang: "es" | "en";
  jobDescription: string;
  activeTab: MobileTab;
  setActiveTab: React.Dispatch<React.SetStateAction<MobileTab>>;
  generateSubTab: "pdf" | "cover-letter";
  setGenerateSubTab: React.Dispatch<React.SetStateAction<"pdf" | "cover-letter">>;
  coverLetterVersion: number;
  setCoverLetterVersion: React.Dispatch<React.SetStateAction<number>>;
}

export function MobileLayout({
  dict,
  methods,
  handleSubmit,
  onSubmit,
  collapseAll,
  setCollapseAll,
  handleApplyCvData,
  handleDownloadPDF,
  getValues,
  lang,
  jobDescription,
  activeTab,
  setActiveTab,
  generateSubTab,
  setGenerateSubTab,
  coverLetterVersion,
  setCoverLetterVersion,
}: Props) {
  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden">
        <AppHeader
          mobile
          importSlot={
            <PdfImporter onImport={handleApplyCvData} dict={dict} mobile />
          }
          translateSlot={
            <TranslateButton
              onTranslate={handleApplyCvData}
              dict={dict}
              getCvData={() => getValues()}
              mobile
            />
          }
        />
      </div>

      {/* Mobile content */}
      <div className="lg:hidden p-3 pb-[72px]">
        {activeTab === "editor" && (
          <EditorContent
            dict={dict}
            methods={methods}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            collapseAll={collapseAll}
            setCollapseAll={setCollapseAll}
          />
        )}
        {activeTab === "generate" && (
          <GenerateContent
            dict={dict}
            getValues={getValues}
            lang={lang}
            jobDescription={jobDescription}
            handleDownloadPDF={handleDownloadPDF}
            generateSubTab={generateSubTab}
            setGenerateSubTab={setGenerateSubTab}
            coverLetterVersion={coverLetterVersion}
            setCoverLetterVersion={setCoverLetterVersion}
          />
        )}
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
    </>
  );
}
