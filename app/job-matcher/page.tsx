"use client";

import { useState, useCallback, useMemo } from "react";
import { useCVForm } from "@/hooks/useCVForm";
import { useCVStore } from "@/stores/cvStore";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import {
  JobDescriptionInput,
  MatchScoreCard,
  KeywordsAnalysis,
  BulletSuggestionCard,
  PrivacyInfoCard,
  ATSReadingParameters,
  ActionButtons,
} from "@/components/job-matcher";
import {
  EXAMPLE_JOB_DESCRIPTION,
  type JobAnalysisResult,
  type BulletSuggestion,
} from "@/types/job-matcher";

/* ── Mock analysis (no real AI) ─────────────────────── */

function mockAnalyzeJob(jobDescription: string): JobAnalysisResult {
  const desc = jobDescription.toLowerCase();
  const allKeywords = [
    "React",
    "Node.js",
    "TypeScript",
    "PostgreSQL",
    "REST APIs",
    "Git",
    "Docker",
    "AWS Lambda",
    "Microfrontends",
    "CI/CD",
    "Agile",
    "GraphQL",
    "AWS",
    "Python",
    "Java",
  ];

  const found = allKeywords.filter(
    (kw) =>
      desc.includes(kw.toLowerCase()) ||
      desc.includes(kw.toLowerCase().replace(".", "")),
  );
  const missing = allKeywords
    .filter((kw) => {
      const lower = kw.toLowerCase().replace(".", "");
      return !desc.includes(lower) && !desc.includes(kw.toLowerCase());
    })
    .slice(0, 4);

  const matchScore = Math.min(98, 55 + found.length * 6);
  const technicalMatch = Math.min(98, 60 + found.length * 5);
  const atsStructure =
    desc.includes("requirements") || desc.includes("responsibilities")
      ? 95
      : 72;
  const softSkillsMatch =
    desc.includes("communication") || desc.includes("team")
      ? desc.includes("lead") || desc.includes("mentor")
        ? 78
        : 65
      : 45;

  const suggestions: BulletSuggestion[] = [
    {
      originalText:
        "Desarrollé la arquitectura del sistema de pagos utilizando Node.js y PostgreSQL, implementando endpoints RESTful para procesar transacciones en tiempo real.",
      adaptedText:
        "Diseñé e implementé la arquitectura de microservicios del sistema de pagos con Node.js, AWS Lambda y PostgreSQL, creando APIs RESTful que procesan +10K transacciones diarias con 99.9% de uptime.",
      position: "Senior Full Stack Developer",
      period: "2022 — Presente",
      matchPointsGained: 22,
      keywordsIntegrated: 4,
    },
    {
      originalText:
        "Lideré el equipo de frontend en la migración de Angular a React, estableciendo estándares de código y realizando code reviews semanales.",
      adaptedText:
        "Lideré la migración estratégica de Angular a React y TypeScript para 3 microfrontends, estableciendo guías de arquitectura y mentoreando a 4 desarrolladores junior en prácticas de CI/CD con Docker.",
      position: "Frontend Tech Lead",
      period: "2021 — 2022",
      matchPointsGained: 18,
      keywordsIntegrated: 5,
    },
  ];

  return {
    matchScore,
    technicalMatch,
    atsStructure,
    softSkillsMatch,
    foundKeywords: found.slice(0, 6),
    missingKeywords: missing,
    suggestions,
  };
}

/* ── Main Page ──────────────────────────────────────── */

export default function JobMatcherPage() {
  return (
    <ErrorBoundary>
      <JobMatcherPageInner />
    </ErrorBoundary>
  );
}

function JobMatcherPageInner() {
  const form = useCVForm();

  // ── Store-backed job description ─────────────────
  const jobDescription = useCVStore((s) => s.jobDescription);
  const setJobDescription = useCVStore((s) => s.setJobDescription);

  // Job matcher UI state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<JobAnalysisResult | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  // Derived stats
  const characterCount = jobDescription.length;
  const requirementCount = useMemo(() => {
    const lines = jobDescription.split("\n").filter((l) => l.trim());
    const bullets = lines.filter((l) => /^[•\-*\d.]/.test(l.trim()));
    const reqSection =
      jobDescription.includes("Requirements") ||
      jobDescription.includes("Requisitos");
    return reqSection ? Math.max(bullets.length, 3) : bullets.length;
  }, [jobDescription]);

  // Analyze job description
  const handleAnalyze = useCallback(() => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);
    // Simulate AI processing delay
    setTimeout(() => {
      const result = mockAnalyzeJob(jobDescription);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 1200);
  }, [jobDescription]);

  // Extract entities (mock)
  const handleExtractEntities = useCallback(() => {
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
      handleAnalyze();
    }, 800);
  }, [handleAnalyze]);

  // Accept suggestion into CV
  const handleAcceptSuggestion = useCallback(
    (suggestion: BulletSuggestion) => {
      if (!form.formData || !form.formData.experience.length) return;

      // Update the first experience entry's descriptions as a demo
      const updated = { ...form.formData };
      const firstExp = updated.experience[0];
      if (firstExp) {
        const currentDesc =
          updated.language === "es"
            ? firstExp.descriptions.es
            : firstExp.descriptions.en;
        const newDesc = currentDesc
          ? `${currentDesc}\n\n${suggestion.adaptedText}`
          : suggestion.adaptedText;

        if (updated.language === "es") {
          firstExp.descriptions = { ...firstExp.descriptions, es: newDesc };
        } else {
          firstExp.descriptions = { ...firstExp.descriptions, en: newDesc };
        }
      }

      form.setValue("experience", updated.experience);
    },
    [form],
  );

  // Loading state
  if (!form.mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary animate-pulse font-headline-xl text-lg">
          Cargando Job Matcher...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ── Hero ──────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pt-6 pb-2">
        <div className="card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-xl text-[1.75rem] lg:text-[2rem] font-semibold text-on-surface">
              Job Matcher ATS
            </h1>
            <p className="text-on-surface-variant font-body-sm text-[0.8125rem] mt-1">
              Adaptación con IA &mdash; Alineá tu perfil profesional con los
              algoritmos ATS
            </p>
          </div>
          <div className="flex items-center gap-2">
            {form.formData?.experience?.[0]?.position && (
              <span className="badge badge-success">
                <span className="material-symbols-outlined text-[0.5rem]">
                  person
                </span>
                {form.formData.experience[0].position[form.lang || "es"] ||
                  "Perfil cargado"}
              </span>
            )}
            {analysisResult && (
              <button
                type="button"
                onClick={handleAnalyze}
                className="btn-secondary flex items-center gap-2 text-[0.8125rem]"
              >
                <span className="material-symbols-outlined text-[16px]">
                  refresh
                </span>
                Re-analizar Oferta
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content: Two panels ─────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ── Left Panel: Job Description Input ── */}
          <div className="lg:col-span-5 order-1">
            <div className="lg:sticky lg:top-20 space-y-4">
              <JobDescriptionInput
                value={jobDescription}
                onChange={setJobDescription}
                onExtractEntities={handleExtractEntities}
                isExtracting={isExtracting}
                characterCount={characterCount}
                requirementCount={requirementCount}
              />

              <PrivacyInfoCard />
              <ATSReadingParameters />
            </div>
          </div>

          {/* ── Right Panel: Results ──────────────── */}
          <div className="lg:col-span-7 order-2">
            {/* Action buttons (top) */}
            <div className="mb-4">
              <ActionButtons
                onAdaptWithAI={handleAnalyze}
                disabled={!jobDescription.trim() || isAnalyzing}
              />
            </div>

            {/* Loading state */}
            {isAnalyzing && (
              <div className="card flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-surface-container-high border-t-primary rounded-full animate-spin mb-4" />
                <p className="font-body-md text-on-surface-variant">
                  Analizando compatibilidad con tu CV...
                </p>
                <p className="font-body-sm text-on-surface-variant/60 text-[0.8125rem] mt-1">
                  Esto puede tomar unos segundos
                </p>
              </div>
            )}

            {/* Results */}
            {analysisResult && !isAnalyzing && (
              <div className="space-y-4">
                {/* Score card */}
                <MatchScoreCard
                  matchScore={analysisResult.matchScore}
                  technicalMatch={analysisResult.technicalMatch}
                  atsStructure={analysisResult.atsStructure}
                  softSkillsMatch={analysisResult.softSkillsMatch}
                />

                {/* Keywords analysis */}
                <KeywordsAnalysis
                  foundKeywords={analysisResult.foundKeywords}
                  missingKeywords={analysisResult.missingKeywords}
                />

                {/* Bullet suggestions */}
                {analysisResult.suggestions.map((suggestion, idx) => (
                  <BulletSuggestionCard
                    key={idx}
                    suggestion={suggestion}
                    onRegenerate={() => {
                      console.log("Regenerate suggestion", idx);
                      // TODO: Call Gemini to regenerate
                    }}
                    onEditManual={() => {
                      console.log("Edit suggestion manually", idx);
                      // TODO: Enable manual editing
                    }}
                    onDiscard={() => {
                      // TODO: dismiss suggestion
                    }}
                    onAccept={() => handleAcceptSuggestion(suggestion)}
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!analysisResult && !isAnalyzing && (
              <div className="card flex flex-col items-center justify-center py-20 text-center">
                <span className="material-symbols-outlined text-outline-variant text-[48px] mb-3">
                  work_outline
                </span>
                <p className="text-on-surface-variant font-body-md">
                  Pegá una descripción de vacante para analizar
                </p>
                <p className="text-on-surface-variant/60 font-body-sm text-[0.8125rem] mt-1 mb-4">
                  El sistema comparará los requisitos con tu CV actual
                </p>
                <button
                  type="button"
                  onClick={() => setJobDescription(EXAMPLE_JOB_DESCRIPTION)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    science
                  </span>
                  Cargar ejemplo de vacante
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
