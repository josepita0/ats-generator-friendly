"use client";

import dynamic from "next/dynamic";
import type { CVData } from "@/types/cv";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const PdfImporter = dynamic(
  () =>
    import("@/components/cv-form/PdfImporter").then((mod) => mod.PdfImporter),
  { ssr: false },
);

interface EditorHeaderProps {
  atsScore: number;
  showPreview: boolean;
  onTogglePreview: () => void;
  onImport: (data: CVData) => void;
  dict: Dictionary;
}

export function EditorHeader({
  atsScore,
  showPreview,
  onTogglePreview,
  onImport,
  dict,
}: EditorHeaderProps) {
  return (
    <div className=" border-outline-variant/30 bg-surface-container-lowest/80 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto px-6 py-10 title_card">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="font-headline-xl text-[2rem] lg:text-[2rem] font-semibold text-on-surface">
              Editor de Currículum
            </h1>
            <p className="text-on-surface-variant font-body-sm text-body-sm mt-1">
              Estructura tus hitos profesionales con redacción de alto impacto
              calibrada para filtros ATS.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-on-primary py-2.5 rounded-full px-4">
            {/* PDF Importer */}
            <PdfImporter onImport={onImport} dict={dict} compact />

            {/* ATS Score Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1  rounded-full">
              <span className="material-symbols-outlined text-primary text-[16px]">
                verified
              </span>
              <div className="flex flex-col justify-center items-center">
                <span className="font-label-xs text-[0.70rem] text-primary font-semibold">
                  ATS
                </span>
                <span className="font-label-xs text-[0.85rem] text-primary font-bold">
                  {atsScore}/100
                </span>
              </div>
            </div>

            {/* Preview Toggle */}
            <button
              type="button"
              onClick={onTogglePreview}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors duration-200 ${
                showPreview
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined text-[16px] ">
                {showPreview ? "visibility_off" : "visibility"}
              </span>
              <span className="font-label-xs text-[0.85rem] font-medium hover:cursor-pointer">
                {showPreview ? "Ocultar Preview" : "Mostrar Preview"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
