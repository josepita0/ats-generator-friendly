"use client";

import { CVData } from "@/types/cv";
import { Dictionary } from "@/lib/i18n/dictionaries";
import { loadCoverLetter } from "@/lib/storage";
import { CoverLetterSection, CoverLetterPreview } from "@/components/cover-letter";
import { CVPreview } from "@/components/cv-preview";

interface Props {
  dict: Dictionary;
  getValues: () => CVData;
  lang: "es" | "en";
  jobDescription: string;
  handleDownloadPDF: () => void;
  generateSubTab: "pdf" | "cover-letter";
  setGenerateSubTab: React.Dispatch<React.SetStateAction<"pdf" | "cover-letter">>;
  coverLetterVersion: number;
  setCoverLetterVersion: React.Dispatch<React.SetStateAction<number>>;
}

export function GenerateContent({
  dict,
  getValues,
  lang,
  jobDescription,
  handleDownloadPDF,
  generateSubTab,
  setGenerateSubTab,
  coverLetterVersion,
  setCoverLetterVersion,
}: Props) {
  return (
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
          onClick={() => {
            setGenerateSubTab("cover-letter");
            setCoverLetterVersion((v) => v + 1);
          }}
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
            const body = lang === "es" ? letter?.es : letter?.en;
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
}
