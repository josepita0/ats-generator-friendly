"use client";

import { useCallback } from "react";
import { CVData } from "@/types/cv";
import { Dictionary } from "@/lib/i18n/dictionaries";
import { CVPreview } from "@/components/cv-preview";
import { generateCvPdf } from "@/lib/pdf/generate";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: CVData | null;
  dict: Dictionary;
}

export function PreviewPanel({ isOpen, onClose, data, dict }: Props) {
  const handleDownloadPDF = useCallback(async () => {
    if (!data) return;
    await generateCvPdf(data, dict);
  }, [data, dict]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[90] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[500px] lg:w-[600px] bg-surface-container-lowest z-[100] flex flex-col border-l border-outline-variant/30 shadow-[-8px_0_30px_-4px_rgba(27,36,30,0.1)] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-spacing-lg py-4 bg-surface-container-low border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              visibility
            </span>
            <h2 className="font-title-md text-title-md text-primary font-semibold">
              Vista Previa ATS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              close
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto  p-spacing-lg">
          {data ? (
            <CVPreview data={data} dict={dict} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="material-symbols-outlined text-outline-variant text-[48px] mb-3">
                description
              </span>
              <p className="text-on-surface-variant font-body-md">
                Sin datos aún
              </p>
              <p className="text-on-surface-variant/60 font-body-sm text-body-sm mt-1">
                Completá el formulario para ver la vista previa
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-spacing-lg bg-surface-container-low border-t border-outline-variant/30">
          <button
            onClick={handleDownloadPDF}
            disabled={!data}
            className="btn-primary flex items-center gap-2 w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            {dict.form.downloadPdf}
          </button>
        </div>
      </div>
    </>
  );
}
