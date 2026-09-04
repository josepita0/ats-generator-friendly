"use client";

import { useState, useCallback } from "react";
import type { CVData, Language } from "@/types/cv";
import { useCVStore } from "@/stores/cvStore";

interface UseBilingualSyncOptions {
  cvData: CVData | undefined | null;
  currentLang: Language;
  onSuccess: (translatedData: CVData) => void;
}

export function useBilingualSync({
  cvData,
  currentLang,
  onSuccess,
}: UseBilingualSyncOptions) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const apiKey = useCVStore((s) => s.apiKey);
  const selectedModel = useCVStore((s) => s.selectedModel);

  const targetLang: Language = currentLang === "es" ? "en" : "es";

  const translate = useCallback(async () => {
    if (!cvData || isTranslating) return;

    if (!apiKey) {
      setError("Por favor configurá tu API key en Ajustes");
      return;
    }

    setIsTranslating(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvData,
          sourceLang: currentLang,
          targetLang,
          apiKey,
          model: selectedModel,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Translation failed");
      }

      onSuccess(result as CVData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Translation failed";
      setError(message);
      console.error("Bilingual sync error:", err);
    } finally {
      setIsTranslating(false);
    }
  }, [cvData, currentLang, targetLang, isTranslating, onSuccess, apiKey, selectedModel]);

  return {
    isTranslating,
    error,
    success,
    translate,
    targetLang,
  };
}
