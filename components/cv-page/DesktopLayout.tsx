"use client";

import dynamic from "next/dynamic";
import { UseFormReturn } from "react-hook-form";
import { CVData } from "@/types/cv";
import { Dictionary } from "@/lib/i18n/dictionaries";
import { ChatSection } from "@/components/chat";
import { CoverLetterSection } from "@/components/cover-letter";
import { AppHeader } from "@/components/cv-form/AppHeader";
import { SidebarPanel } from "@/components/cv-preview/SidebarPanel";
import { EditorContent } from "./EditorContent";

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
  handlePreview: () => void;
  handleApplyCvData: (data: CVData) => void;
  handleApplyChatSuggestion: (
    suggestion: import("@/types/chat").Suggestion,
    updatedCv: CVData,
  ) => void;
  getValues: UseFormReturn<CVData>["getValues"];
  setValue: UseFormReturn<CVData>["setValue"];
  lang: "es" | "en";
  jobDescription: string;
  setJobDescription: React.Dispatch<React.SetStateAction<string>>;
}

export function DesktopLayout({
  dict,
  methods,
  handleSubmit,
  onSubmit,
  collapseAll,
  setCollapseAll,
  handlePreview,
  handleApplyCvData,
  handleApplyChatSuggestion,
  getValues,
  setValue,
  lang,
  jobDescription,
  setJobDescription,
}: Props) {
  return (
    <div className="max-w-[1280px] mx-auto p-5">
      <div className="pixel-border-orange bg-[#071539]">
        <AppHeader
          importSlot={
            <PdfImporter onImport={handleApplyCvData} dict={dict} compact />
          }
          translateSlot={
            <TranslateButton
              onTranslate={handleApplyCvData}
              dict={dict}
              getCvData={() => getValues()}
              compact
            />
          }
        />

        <div className="p-5 grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-5">
          <div className="pixel-panel  rounded-[10px] p-4 max-h-[calc(100vh-180px)] overflow-y-auto px-scroll flex flex-col gap-4">
            <EditorContent
              dict={dict}
              methods={methods}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              collapseAll={collapseAll}
              setCollapseAll={setCollapseAll}
              className="flex flex-col gap-4"
              saveButtonClassName="flex justify-center pt-2 pb-1"
            />
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
  );
}
