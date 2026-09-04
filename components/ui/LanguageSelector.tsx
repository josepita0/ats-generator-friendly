"use client";

import dynamic from "next/dynamic";
import type { CVData } from "@/types/cv";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const TranslateButton = dynamic(
  () =>
    import("@/components/cv-form/TranslateButton").then(
      (mod) => mod.TranslateButton,
    ),
  { ssr: false },
);

interface LanguageSelectorProps {
  lang: "es" | "en";
  onChange: (lang: "es" | "en") => void;
  onTranslate: (data: CVData) => void;
  getCvData: () => CVData;
  dict: Dictionary;
}

export function LanguageSelector({
  lang,
  onChange,
  onTranslate,
  getCvData,
  dict,
}: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-1 rounded-full p-1 mx-4 justify-between">
      <div>
        <button
          type="button"
          onClick={() => onChange("es")}
          className={`px-2.5 py-1 rounded-full text-[0.75rem] font-semibold transition-colors hover:cursor-pointer ${
            lang === "es"
              ? "bg-primary text-on-primary"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          }`}
        >
          ES • Español
        </button>
        <button
          type="button"
          onClick={() => onChange("en")}
          className={`px-2.5 py-1 rounded-full text-[0.75rem] font-semibold transition-colors hover:cursor-pointer ${
            lang === "en"
              ? "bg-primary text-on-primary"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          }`}
        >
          EN • English
        </button>
      </div>

      {/* Translate Button */}
      <TranslateButton
        onTranslate={onTranslate}
        dict={dict}
        getCvData={getCvData}
        compact
      />
    </div>
  );
}
