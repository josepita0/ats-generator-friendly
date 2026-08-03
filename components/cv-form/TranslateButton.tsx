'use client';

import { useState } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { CVData } from '@/types/cv';

interface Props {
  onTranslate: (data: CVData) => void;
  dict: Dictionary;
  getCvData: () => CVData;
  compact?: boolean;
}

type TranslateState = 'idle' | 'translating' | 'success' | 'error';

export function TranslateButton({ onTranslate, dict, getCvData, compact = false }: Props) {
  const [state, setState] = useState<TranslateState>('idle');
  const [error, setError] = useState('');
  const [direction, setDirection] = useState<'es-to-en' | 'en-to-es'>('es-to-en');

  const handleTranslate = async () => {
    setState('translating');
    setError('');

    const sourceLang = direction === 'es-to-en' ? 'es' : 'en';
    const targetLang = direction === 'es-to-en' ? 'en' : 'es';
    const currentData = getCvData();

    try {
      const response = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData: currentData, sourceLang, targetLang }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Translation failed');
      }

      const result: CVData = await response.json();
      setState('success');
      onTranslate(result);

      setTimeout(() => setState('idle'), 3000);
    } catch (err) {
      console.error('Translation error:', err);
      setState('error');
      setError(err instanceof Error ? err.message : dict.translate.error);
    }
  };

  const getButtonText = () => {
    switch (state) {
      case 'translating':
        return dict.translate.processing;
      case 'success':
        return dict.translate.success;
      case 'error':
        return dict.translate.tryAgain;
      default:
        return 'TRANSLATE';
    }
  };

  if (compact) {
    return (
      <div className="relative flex items-center gap-2">
        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value as 'es-to-en' | 'en-to-es')}
          disabled={state === 'translating'}
          className="px-input w-auto text-xs py-1 px-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.55rem' }}
        >
          <option value="es-to-en">ES→EN</option>
          <option value="en-to-es">EN→ES</option>
        </select>
        <button
          type="button"
          onClick={handleTranslate}
          disabled={state === 'translating'}
          className="px-btn-teal flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m0 4l-3 6m0 0l-3-6m3 6h6m-4 8l4-8m0 0l4 8" />
          </svg>
          {getButtonText()}
        </button>
        {state === 'error' && (
          <p className="absolute top-full left-0 mt-1 text-[10px] text-red-400 font-label-md whitespace-nowrap">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-on-surface-variant font-label-md">{dict.translate.direction}</span>
        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value as 'es-to-en' | 'en-to-es')}
          disabled={state === 'translating'}
          className="bg-surface-variant text-on-surface retro-border rounded-full px-3 py-1 text-sm font-label-md"
        >
          <option value="es-to-en">{dict.translate.esToEn}</option>
          <option value="en-to-es">{dict.translate.enToEs}</option>
        </select>
      </div>
      <button
        type="button"
        onClick={handleTranslate}
        disabled={state === 'translating'}
        className="flex items-center gap-2 bg-surface-variant text-on-surface px-6 py-4 font-label-md font-bold rounded-full retro-border hover:bg-surface-bright transition-colors disabled:opacity-50"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m0 4l-3 6m0 0l-3-6m3 6h6m-4 8l4-8m0 0l4 8" />
        </svg>
        {getButtonText()}
      </button>
      {state === 'idle' && (
        <p className="text-sm text-on-surface-variant font-label-md">{dict.translate.description}</p>
      )}
      {state === 'error' && (
        <p className="text-sm text-red-400 font-label-md">{error}</p>
      )}
    </div>
  );
}
