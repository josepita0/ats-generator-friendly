"use client";

import { UseFormReturn } from "react-hook-form";
import { CVData } from "@/types/cv";
import { Dictionary } from "@/lib/i18n/dictionaries";
import { FormProvider } from "react-hook-form";
import {
  PersonalInfoSection,
  SummarySection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  LanguagesSection,
} from "@/components/cv-form";

interface Props {
  dict: Dictionary;
  methods: UseFormReturn<CVData>;
  handleSubmit: UseFormReturn<CVData>["handleSubmit"];
  onSubmit: (data: CVData) => void;
  collapseAll: boolean | null;
  setCollapseAll: React.Dispatch<React.SetStateAction<boolean | null>>;
  lang: "es" | "en";
  onLangChange: (lang: "es" | "en") => void;
  isTranslating: boolean;
  translationSuccess: boolean;
  translationError: string | null;
  onSync: () => void;
  targetLang: "es" | "en";
  atsScore: number;
}

export function EditorWorkspace({
  dict,
  methods,
  handleSubmit,
  onSubmit,
  collapseAll,
  setCollapseAll,
  lang,
  onLangChange,
  isTranslating,
  translationSuccess,
  translationError,
  onSync,
  targetLang,
  atsScore,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Language switcher + sync badge */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center bg-surface-container rounded-full p-0.5">
          <button
            type="button"
            onClick={() => onLangChange("es")}
            className={`chip ${lang === "es" ? "chip-active" : "chip-inactive"}`}
          >
            ES
          </button>
          <button
            type="button"
            onClick={() => onLangChange("en")}
            className={`chip ${lang === "en" ? "chip-active" : "chip-inactive"}`}
          >
            EN
          </button>
        </div>
        <button
          type="button"
          onClick={onSync}
          disabled={isTranslating}
          className="badge badge-success gap-1 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {isTranslating ? (
            <span className="material-symbols-outlined text-[0.625rem] animate-spin">
              progress_activity
            </span>
          ) : translationSuccess ? (
            <span className="material-symbols-outlined text-[0.625rem]">
              check_circle
            </span>
          ) : (
            <span className="material-symbols-outlined text-[0.625rem]">
              sync
            </span>
          )}
          {isTranslating
            ? `Traduciendo a ${targetLang.toUpperCase()}...`
            : translationSuccess
              ? "¡Traducido!"
              : `Sync → ${targetLang.toUpperCase()}`}
        </button>
      </div>

      {/* Translation error */}
      {translationError && (
        <div className="text-error text-[0.75rem] font-label-xs bg-error-container/30 rounded-lg px-3 py-2">
          {translationError}
        </div>
      )}

      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-title-md text-title-md text-on-surface">
            Experiencia Laboral
          </h2>
          <p className="text-on-surface-variant text-[0.75rem] font-label-xs mt-0.5">
            ATS Score:{" "}
            <span
              className={
                atsScore >= 80
                  ? "text-primary"
                  : atsScore >= 60
                    ? "text-tertiary"
                    : "text-error"
              }
            >
              {atsScore}%
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCollapseAll(collapseAll ? null : true)}
          className="btn-ghost text-[0.8125rem] flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">
            {collapseAll ? "expand_more" : "expand_less"}
          </span>
          {collapseAll ? dict.expandAll : dict.collapseAll}
        </button>
      </div>

      {/* Form sections */}
      <FormProvider {...methods}>
        <div className="space-y-4">
          <div id="personal-info">
            <PersonalInfoSection dict={dict} forceCollapsed={collapseAll} />
          </div>
          <div id="summary">
            <SummarySection dict={dict} forceCollapsed={collapseAll} />
          </div>
          <div id="experience">
            <ExperienceSection dict={dict} forceCollapsed={collapseAll} />
          </div>
          <div id="education">
            <EducationSection dict={dict} forceCollapsed={collapseAll} />
          </div>
          <div id="skills">
            <SkillsSection dict={dict} forceCollapsed={collapseAll} />
          </div>
          <div id="languages">
            <LanguagesSection dict={dict} forceCollapsed={collapseAll} />
          </div>
        </div>
      </FormProvider>

      {/* Save button */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-center pt-4 pb-2"
      >
        <button type="submit" className="btn-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">save</span>
          {dict.form.saving}
        </button>
      </form>
    </div>
  );
}
