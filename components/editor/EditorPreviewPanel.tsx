"use client";

import { CVPreview } from "@/components/cv-preview";
import type { CVData } from "@/types/cv";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface EditorPreviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: CVData | null;
  dict: Dictionary;
}

export function EditorPreviewPanel({
  isOpen,
  onClose,
  data,
  dict,
}: EditorPreviewPanelProps) {
  if (!isOpen || !data) return null;

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-[450px] xl:w-[500px] lg:border-l lg:border-outline-variant/30 bg-surface-container-lowest h-full shrink-0 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 bg-surface-container-low">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">
            visibility
          </span>
          <h2 className="font-title-md text-title-md text-primary font-semibold">
            Vista Previa ATS
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="min-w-[44px] min-h-[44px] rounded-full bg-surface-container hover:bg-surface-container-high transition-colors duration-200 flex items-center justify-center"
          aria-label="Cerrar preview"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
            close
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scroll  p-6">
        <CVPreview data={data} dict={dict} />
      </div>
    </aside>
  );
}
