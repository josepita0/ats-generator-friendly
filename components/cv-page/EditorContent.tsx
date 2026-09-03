"use client";

import { FormProvider, UseFormReturn } from "react-hook-form";
import { CVData } from "@/types/cv";
import { Dictionary } from "@/lib/i18n/dictionaries";
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
  /** Extra CSS class for the outer wrapper (e.g. for desktop scroll panel) */
  className?: string;
  /** Spacing variant for the save button */
  saveButtonClassName?: string;
}

export function EditorContent({
  dict,
  methods,
  handleSubmit,
  onSubmit,
  collapseAll,
  setCollapseAll,
  className,
  saveButtonClassName,
}: Props) {
  return (
    <div className={className ?? "flex flex-col gap-3"}>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setCollapseAll(collapseAll ? null : true)}
          className="px-btn-small bg-surface-variant text-[#FFF3D5] flex items-center gap-1"
        >
          {collapseAll ? (
            <>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
              {dict.expandAll}
            </>
          ) : (
            <>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
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
        className={saveButtonClassName ?? "flex justify-center pt-1 pb-1"}
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
}
