'use client';

import { useState, useCallback } from 'react';

/* ── Types ───────────────────────────────────── */

export interface ImprovementSuggestion {
  original: string;
  improved: string;
  reason: string;
  type: 'verb' | 'metric' | 'length' | 'keyword' | 'clarity';
}

interface AnalyzeOptions {
  section: string;
  content: string;
  lang: 'es' | 'en';
  context?: string;
}

/* ── Hook ────────────────────────────────────── */

export function useSectionImprovement() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async ({ section, content, lang, context }: AnalyzeOptions) => {
    setIsAnalyzing(true);
    setError(null);
    setSuggestions([]);

    try {
      const response = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, content, lang, context }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze content');
      }

      setSuggestions(result.suggestions || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze content';
      setError(message);
      console.error('Section improvement error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  const dismissSuggestion = useCallback((index: number) => {
    setSuggestions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return {
    isAnalyzing,
    suggestions,
    error,
    analyze,
    clearSuggestions,
    dismissSuggestion,
  };
}
