"use client";

import { useCallback } from "react";
import { FormProvider } from "react-hook-form";
import type { EditorSection } from "./types";
import type { UseFormReturn } from "react-hook-form";
import type { CVData } from "@/types/cv";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { useSectionATSScore } from "@/lib/cv/sectionATSScore";
import { useSectionImprovement } from "@/hooks/useSectionImprovement";
import { getSectionContentForAnalysis } from "@/lib/cv/analyzeSection";
import { SectionATSFeedback } from "./SectionATSFeedback";
import { AIImprovementPanel } from "./AIImprovementPanel";
import { PersonalInfoSectionNew } from "@/components/cv-form/PersonalInfoSection.new";
import { SummarySectionNew } from "@/components/cv-form/SummarySection.new";
import { ExperienceSectionNew } from "@/components/cv-form/ExperienceSection.new";
import { EducationSectionNew } from "@/components/cv-form/EducationSection.new";
import { SkillsSectionNew } from "@/components/cv-form/SkillsSection.new";
import { LanguagesSectionNew } from "@/components/cv-form/LanguagesSection.new";

/* ── Props ───────────────────────────────────── */

interface EditorWorkspaceProps {
  activeSection: EditorSection;
  onSectionChange: (section: EditorSection) => void;
  methods: UseFormReturn<CVData>;
  dict: Dictionary;
  lang: "es" | "en";
  cvData: CVData | null;
}

/* ── Sections that support AI analysis ───────── */

const ANALYZABLE_SECTIONS: EditorSection[] = [
  "summary",
  "experience",
  "education",
  "skills",
  "languages",
];

/* ── Section config ──────────────────────────── */

const sectionConfig = {
  "personal-info": {
    titleKey: "personalInfo" as const,
    icon: "person",
    description: "Información básica de contacto",
  },
  summary: {
    titleKey: "summary" as const,
    icon: "description",
    description: "Breve descripción de tu perfil profesional",
  },
  experience: {
    titleKey: "experience" as const,
    icon: "work",
    description: "Prioriza logros cuantificables con métricas",
  },
  education: {
    titleKey: "education" as const,
    icon: "school",
    description: "Formación académica y certificaciones",
  },
  skills: {
    titleKey: "skills" as const,
    icon: "code",
    description: "Tecnologías, herramientas y competencias",
  },
  languages: {
    titleKey: "languages" as const,
    icon: "language",
    description: "Idiomas y nivel de dominio",
  },
};

/* ── Component ───────────────────────────────── */

export function EditorWorkspace({
  activeSection,
  onSectionChange,
  methods,
  dict,
  lang,
  cvData,
}: EditorWorkspaceProps) {
  const config = sectionConfig[activeSection];
  const title = dict.form[config.titleKey];
  const sectionScore = useSectionATSScore(cvData, activeSection, lang);
  const {
    isAnalyzing,
    suggestions,
    error,
    analyze,
    clearSuggestions,
    dismissSuggestion,
  } = useSectionImprovement();

  const canAnalyze =
    ANALYZABLE_SECTIONS.includes(activeSection) && cvData !== null;

  /* ── Analyze handler ──────────────────────────── */

  const handleAnalyze = useCallback(() => {
    if (!cvData) return;
    const input = getSectionContentForAnalysis(cvData, activeSection, lang);
    if (!input) return;
    analyze({
      section: activeSection,
      content: input.content,
      lang,
      context: input.context,
    });
  }, [cvData, activeSection, lang, analyze]);

  /* ── Apply suggestion to form ─────────────────── */

  const applySuggestionToForm = useCallback(
    (improved: string, index: number) => {
      const values = methods.getValues() as CVData;

      switch (activeSection) {
        case "summary": {
          // Replace only the matched fragment so the rest of the summary is preserved
          const current = values.summary?.[lang] ?? "";
          const original = suggestions[index]?.original;
          if (original && current.includes(original)) {
            methods.setValue(
              `summary.${lang}`,
              current.replace(original, improved),
            );
            return;
          }
          // Fallback: if original not found, copy improved to clipboard
          navigator.clipboard?.writeText(improved);
          break;
        }

        case "experience": {
          const experience = values.experience || [];
          for (let i = 0; i < experience.length; i++) {
            const desc = experience[i].descriptions[lang];
            if (desc && desc.includes(suggestions[index].original)) {
              const updated = desc.replace(
                suggestions[index].original,
                improved,
              );
              methods.setValue(`experience.${i}.descriptions.${lang}`, updated);
              return;
            }
          }
          // Fallback: if original not found, copy improved to clipboard
          navigator.clipboard?.writeText(improved);
          break;
        }

        case "education": {
          const education = values.education || [];
          for (let i = 0; i < education.length; i++) {
            const degree = education[i].degree[lang];
            if (degree && degree.includes(suggestions[index].original)) {
              const updated = degree.replace(
                suggestions[index].original,
                improved,
              );
              methods.setValue(`education.${i}.degree.${lang}`, updated);
              return;
            }
            const field = education[i].field[lang];
            if (field && field.includes(suggestions[index].original)) {
              const updated = field.replace(
                suggestions[index].original,
                improved,
              );
              methods.setValue(`education.${i}.field.${lang}`, updated);
              return;
            }
          }
          navigator.clipboard?.writeText(improved);
          break;
        }

        case "skills": {
          // Skills are flat string arrays — find the matching skill and replace
          const skills = values.skills || [];
          for (let catIdx = 0; catIdx < skills.length; catIdx++) {
            const skillIdx = skills[catIdx].skills.findIndex((s) =>
              s.includes(suggestions[index].original),
            );
            if (skillIdx !== -1) {
              methods.setValue(`skills.${catIdx}.skills.${skillIdx}`, improved);
              return;
            }
          }
          navigator.clipboard?.writeText(improved);
          break;
        }

        case "languages": {
          const languages = values.languages || [];
          for (let i = 0; i < languages.length; i++) {
            if (languages[i].language.includes(suggestions[index].original)) {
              methods.setValue(`languages.${i}.language`, improved);
              return;
            }
            if (languages[i].level.includes(suggestions[index].original)) {
              methods.setValue(`languages.${i}.level`, improved);
              return;
            }
          }
          navigator.clipboard?.writeText(improved);
          break;
        }

        default:
          break;
      }
    },
    [activeSection, lang, methods, suggestions],
  );

  /* ── Edit suggestion (user modifies then applies) */

  const handleEdit = useCallback(
    (improved: string, index: number) => {
      applySuggestionToForm(improved, index);
    },
    [applySuggestionToForm],
  );

  /* ── Discard suggestion ───────────────────────── */

  const handleDiscard = useCallback(
    (index: number) => {
      dismissSuggestion(index);
    },
    [dismissSuggestion],
  );

  /* ── Render ───────────────────────────────────── */

  return (
    <FormProvider {...methods}>
      <div className="flex-1 max-w-4xl mx-auto  py-6">
        {/* Mobile: Section dropdown */}
        <div className="lg:hidden mb-4">
          <label className="font-label-xs text-label-xs text-on-surface-variant tracking-wider mb-1.5 block">
            Sección
          </label>
          <select
            value={activeSection}
            onChange={(e) => onSectionChange(e.target.value as EditorSection)}
            className="w-full h-[46px] px-3.5 bg-surface-container-lowest border border-outline-variant/40 rounded-xl font-body-md text-on-surface editor-transition focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          >
            {Object.entries(sectionConfig).map(([key, cfg]) => (
              <option key={key} value={key}>
                {dict.form[cfg.titleKey]}
              </option>
            ))}
          </select>
        </div>

        {/* Section Header */}
        <div className="mb-6 ">
          <div className="flex items-start justify-start gap-6 mb-2">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[22px]">
                {config.icon}
              </span>
              <h2 className="font-headline-lg text-headline-lg text-[1.75rem] text-on-surface ">
                {title}
              </h2>
            </div>

            {/* Section ATS Score badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary rounded-full">
              <span className="material-symbols-outlined text-on-primary text-[16px]">
                verified
              </span>
              <span className="font-label-xs text-[0.70rem] text-on-primary font-semibold">
                ATS: {sectionScore.score}%
              </span>
            </div>
          </div>

          <p className="text-on-surface-variant font-body-md text-body-md">
            {config.description}
          </p>
        </div>

        {/* AI Analyze button */}
        {canAnalyze && (
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`btn-secondary flex items-center gap-1.5 mb-6 disabled:cursor-not-allowed ${isAnalyzing ? 'ring-2 ring-primary/30' : ''}`}
          >
            <span className={`material-symbols-outlined text-[16px] ${isAnalyzing ? 'animate-pulse text-primary' : ''}`}>
              {isAnalyzing ? "hourglass_empty" : "auto_awesome"}
            </span>
            {isAnalyzing ? "Analizando…" : "Analizar con IA"}
          </button>
        )}

        {/* Section Content */}
        {activeSection === "personal-info" && <PersonalInfoSectionNew />}
        {activeSection === "summary" && <SummarySectionNew lang={lang} />}
        {activeSection === "experience" && <ExperienceSectionNew lang={lang} />}
        {activeSection === "education" && <EducationSectionNew lang={lang} />}
        {activeSection === "skills" && <SkillsSectionNew />}
        {activeSection === "languages" && <LanguagesSectionNew />}

        {/* ATS contextual feedback */}
        <SectionATSFeedback score={sectionScore} />

        {/* AI Improvement Panel */}
        <AIImprovementPanel
          suggestions={suggestions}
          isAnalyzing={isAnalyzing}
          error={error}
          onAccept={applySuggestionToForm}
          onEdit={handleEdit}
          onDiscard={handleDiscard}
          onClear={clearSuggestions}
        />
      </div>
    </FormProvider>
  );
}
