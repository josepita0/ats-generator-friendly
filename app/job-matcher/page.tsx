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
import { CVPreview } from "@/components/cv-preview";
import {
  type JobAnalysisResult,
  type BulletSuggestion,
} from "@/types/job-matcher";

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
  const apiKey = useCVStore((s) => s.apiKey);
  const selectedModel = useCVStore((s) => s.selectedModel);
  const atsTone = useCVStore((s) => s.atsTone);

  // Job matcher UI state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<JobAnalysisResult | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Suggestion interaction state
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<number>>(
    new Set(),
  );
  const [editingSuggestion, setEditingSuggestion] = useState<number | null>(
    null,
  );
  const [editText, setEditText] = useState<string>("");
  const [regeneratingIdx, setRegeneratingIdx] = useState<number | null>(null);
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<Set<number>>(
    new Set(),
  );

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

  // Analyze job description via real AI endpoint
  const handleAnalyze = useCallback(async () => {
    if (!jobDescription.trim() || !apiKey || !form.formData) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/job-matcher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          model: selectedModel,
          tone: atsTone,
          jobDescription,
          cvData: {
            personalInfo: form.formData.personalInfo,
            summary: form.formData.summary,
            experience: form.formData.experience,
            education: form.formData.education,
            skills: form.formData.skills,
            languages: form.formData.languages,
            language: form.formData.language,
          },
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.error ||
            `Failed to analyze job description (${response.status})`,
        );
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, [jobDescription, apiKey, selectedModel, atsTone, form.formData]);

  // Extract entities (mock — wraps analyze)
  const handleExtractEntities = useCallback(() => {
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
      handleAnalyze();
    }, 800);
  }, [handleAnalyze]);

  // Accept suggestion into CV
  const handleAcceptSuggestion = useCallback(
    (suggestion: BulletSuggestion, idx: number) => {
      if (!form.formData || !form.formData.experience.length) return;

      const updated = { ...form.formData };

      // Find the experience that contains the originalText
      const targetExpIndex = updated.experience.findIndex((exp) => {
        const desc =
          updated.language === "es"
            ? exp.descriptions.es
            : exp.descriptions.en;
        return desc && desc.includes(suggestion.originalText);
      });

      if (targetExpIndex === -1) return; // No match found

      const targetExp = updated.experience[targetExpIndex];

      // Replace the exact original text with the adapted text
      const currentDesc =
        updated.language === "es"
          ? targetExp.descriptions.es
          : targetExp.descriptions.en;
      const newDesc = currentDesc?.replace(
        suggestion.originalText,
        suggestion.adaptedText,
      );

      if (updated.language === "es") {
        targetExp.descriptions = { ...targetExp.descriptions, es: newDesc };
      } else {
        targetExp.descriptions = { ...targetExp.descriptions, en: newDesc };
      }

      form.setValue("experience", updated.experience);

      // Track accepted suggestion for visual feedback
      setAcceptedSuggestions((prev) => {
        const next = new Set(prev);
        next.add(idx);
        return next;
      });
    },
    [form],
  );

  // Discard suggestion
  const handleDiscardSuggestion = useCallback((idx: number) => {
    setDismissedSuggestions((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  }, []);

  // Start editing suggestion
  const handleStartEdit = useCallback(
    (idx: number) => {
      if (!analysisResult) return;
      setEditingSuggestion(idx);
      setEditText(analysisResult.suggestions[idx]?.adaptedText ?? "");
    },
    [analysisResult],
  );

  // Save edited suggestion
  const handleSaveEdit = useCallback(() => {
    if (editingSuggestion === null || !analysisResult) return;
    const updated = { ...analysisResult };
    updated.suggestions = [...updated.suggestions];
    updated.suggestions[editingSuggestion] = {
      ...updated.suggestions[editingSuggestion],
      adaptedText: editText,
    };
    setAnalysisResult(updated);
    setEditingSuggestion(null);
    setEditText("");
  }, [editingSuggestion, editText, analysisResult]);

  // Cancel editing
  const handleCancelEdit = useCallback(() => {
    setEditingSuggestion(null);
    setEditText("");
  }, []);

  // Regenerate a single suggestion via Gemini
  const handleRegenerateSuggestion = useCallback(
    async (idx: number) => {
      if (!analysisResult || !apiKey || !form.formData) return;
      const suggestion = analysisResult.suggestions[idx];
      if (!suggestion) return;

      setRegeneratingIdx(idx);
      try {
        const response = await fetch("/api/ai/job-matcher", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            apiKey,
            model: selectedModel,
            tone: atsTone,
            jobDescription,
            cvData: {
              personalInfo: form.formData.personalInfo,
              summary: form.formData.summary,
              experience: form.formData.experience,
              education: form.formData.education,
              skills: form.formData.skills,
              languages: form.formData.languages,
              language: form.formData.language,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to regenerate (${response.status})`);
        }

        const result: JobAnalysisResult = await response.json();

        // Try to find a matching suggestion by originalText
        const match = result.suggestions.find(
          (s) => s.originalText === suggestion.originalText,
        );

        if (match) {
          const updated = { ...analysisResult };
          updated.suggestions = [...updated.suggestions];
          updated.suggestions[idx] = match;
          setAnalysisResult(updated);
        } else {
          // If no exact match, replace with the first suggestion from new results
          if (result.suggestions.length > 0) {
            const updated = { ...analysisResult };
            updated.suggestions = [...updated.suggestions];
            updated.suggestions[idx] = result.suggestions[0];
            setAnalysisResult(updated);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al regenerar la sugerencia",
        );
      } finally {
        setRegeneratingIdx(null);
      }
    },
    [
      analysisResult,
      apiKey,
      selectedModel,
      atsTone,
      jobDescription,
      form.formData,
    ],
  );

  // Filtered suggestions (remove dismissed)
  const visibleSuggestions = useMemo(() => {
    if (!analysisResult) return [];
    return analysisResult.suggestions.filter(
      (_, idx) => !dismissedSuggestions.has(idx),
    );
  }, [analysisResult, dismissedSuggestions]);

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
                disabled={!jobDescription.trim()}
                isAnalyzing={isAnalyzing}
                hasApiKey={!!apiKey}
              />
            </div>

            {/* Current CV Preview */}
            {form.formData && (
              <div className="card mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    description
                  </span>
                  <h3 className="font-title-md text-[0.9375rem] font-semibold text-on-surface">
                    Tu CV actual
                  </h3>
                </div>
                <div className="max-h-[500px] overflow-y-auto custom-scroll">
                  <CVPreview data={form.formData} dict={form.dict} />
                </div>
              </div>
            )}

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

            {/* Error state */}
            {error && !isAnalyzing && (
              <div className="card border border-error/30 bg-error/5 flex flex-col items-center py-8 px-6 text-center">
                <span className="material-symbols-outlined text-error text-[36px] mb-3">
                  error
                </span>
                <p className="font-body-md text-on-surface mb-1">
                  Error al analizar la vacante
                </p>
                <p className="font-body-sm text-on-surface-variant/70 text-[0.8125rem] mb-4 max-w-md">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="btn-secondary flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    refresh
                  </span>
                  Reintentar
                </button>
              </div>
            )}

            {/* Results */}
            {analysisResult && !isAnalyzing && !error && (
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
                {visibleSuggestions.length > 0 ? (
                  visibleSuggestions.map((suggestion, displayIdx) => {
                    // Find original index in analysisResult for state tracking
                    const originalIdx =
                      analysisResult!.suggestions.indexOf(suggestion);
                    const isEditing = editingSuggestion === originalIdx;
                    const isRegenerating = regeneratingIdx === originalIdx;

                    return (
                      <BulletSuggestionCard
                        key={originalIdx}
                        suggestion={suggestion}
                        isEditing={isEditing}
                        editText={editText}
                        onEditTextChange={setEditText}
                        isRegenerating={isRegenerating}
                        onRegenerate={() =>
                          handleRegenerateSuggestion(originalIdx)
                        }
                        onEditManual={() => handleStartEdit(originalIdx)}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                        onDiscard={() => handleDiscardSuggestion(originalIdx)}
                        isAccepted={acceptedSuggestions.has(originalIdx)}
                        onAccept={() =>
                          handleAcceptSuggestion(suggestion, originalIdx)
                        }
                      />
                    );
                  })
                ) : analysisResult && !isAnalyzing ? (
                  <div className="card flex flex-col items-center justify-center py-12 text-center">
                    <span className="material-symbols-outlined text-outline-variant text-[40px] mb-3">
                      check_circle
                    </span>
                    <p className="font-body-md text-on-surface-variant">
                      Todas las sugerencias fueron descartadas
                    </p>
                    <p className="font-body-sm text-on-surface-variant/60 text-[0.8125rem] mt-1 mb-4">
                      Podés re-analizar la oferta para obtener nuevas
                      sugerencias
                    </p>
                    <button
                      type="button"
                      onClick={handleAnalyze}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        refresh
                      </span>
                      Re-analizar Oferta
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
