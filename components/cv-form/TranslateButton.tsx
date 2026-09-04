'use client';

import { useState } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { CVData } from '@/types/cv';

interface Props {
  onTranslate: (data: CVData) => void;
  dict: Dictionary;
  getCvData: () => CVData;
  compact?: boolean;
  mobile?: boolean;
}

type TranslateState = 'idle' | 'translating' | 'success' | 'error';

export function TranslateButton({ onTranslate, dict, getCvData, compact = false, mobile = false }: Props) {
  const [state, setState] = useState<TranslateState>('idle');
  const [error, setError] = useState('');
  const [direction, setDirection] = useState<'es-to-en' | 'en-to-es'>('es-to-en');
  const [showDirectionPicker, setShowDirectionPicker] = useState(false);

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
        return dict.translate.button;
    }
  };

  const isTranslating = state === 'translating';

  if (mobile) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowDirectionPicker(!showDirectionPicker)}
          disabled={isTranslating}
          className="btn-secondary w-10 h-10 flex items-center justify-center p-0 !rounded-full"
          title={isTranslating ? getButtonText() : undefined}
        >
          <span className={`material-symbols-outlined text-[18px] ${isTranslating ? 'animate-pulse text-primary' : ''}`}>
            {isTranslating ? 'hourglass_empty' : 'translate'}
          </span>
        </button>

        {showDirectionPicker && (
          <div className="absolute top-full right-0 mt-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-3 shadow-card z-[90] min-w-[160px]">
            <p className="text-on-surface-variant font-label-xs font-bold text-[10px] mb-2 text-center uppercase">
              {dict.translate.direction}
            </p>
            <div className="flex flex-col gap-1.5 mb-2">
              <button
                type="button"
                onClick={() => { setDirection('es-to-en'); setShowDirectionPicker(false); handleTranslate(); }}
                disabled={state === 'translating'}
                className={`chip ${direction === 'es-to-en' ? 'chip-active' : 'chip-inactive'} w-full justify-center text-[10px]`}
              >
                {dict.translate.esToEn}
              </button>
              <button
                type="button"
                onClick={() => { setDirection('en-to-es'); setShowDirectionPicker(false); handleTranslate(); }}
                disabled={state === 'translating'}
                className={`chip ${direction === 'en-to-es' ? 'chip-active' : 'chip-inactive'} w-full justify-center text-[10px]`}
              >
                {dict.translate.enToEs}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowDirectionPicker(false)}
              className="chip chip-inactive w-full justify-center text-[9px]"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }

  if (compact) {
    return (
      <div className="relative flex items-center gap-2">
        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value as 'es-to-en' | 'en-to-es')}
          disabled={isTranslating}
          className="input-field w-auto text-xs py-1 px-2"
        >
          <option value="es-to-en">ES→EN</option>
          <option value="en-to-es">EN→ES</option>
        </select>
        <button
          type="button"
          onClick={handleTranslate}
          disabled={isTranslating}
          className={`btn-secondary flex items-center gap-1.5 text-[0.8125rem] ${isTranslating ? 'ring-2 ring-primary/30' : ''}`}
        >
          <span className={`material-symbols-outlined text-[16px] ${isTranslating ? 'animate-pulse text-primary' : ''}`}>
            {isTranslating ? 'hourglass_empty' : 'translate'}
          </span>
          {getButtonText()}
        </button>
        {state === 'error' && (
          <p className="absolute top-full left-0 mt-1 text-[10px] text-error font-label-xs whitespace-nowrap z-10 bg-surface-container-lowest px-2 py-1 rounded shadow-lg">{error}</p>
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
          disabled={isTranslating}
          className="input-field w-auto rounded-full px-3 py-1 text-sm font-label-md"
        >
          <option value="es-to-en">{dict.translate.esToEn}</option>
          <option value="en-to-es">{dict.translate.enToEs}</option>
        </select>
      </div>
      <button
        type="button"
        onClick={handleTranslate}
        disabled={isTranslating}
        className={`btn-secondary flex items-center gap-2 px-6 py-4 font-label-md font-bold rounded-full transition-colors disabled:cursor-not-allowed ${isTranslating ? 'ring-2 ring-primary/30' : ''}`}
      >
        <span className={`material-symbols-outlined text-[20px] ${isTranslating ? 'animate-pulse text-primary' : ''}`}>
          {isTranslating ? 'hourglass_empty' : 'translate'}
        </span>
        {getButtonText()}
      </button>
      {state === 'idle' && (
        <p className="text-sm text-on-surface-variant font-label-md">{dict.translate.description}</p>
      )}
      {state === 'error' && (
        <p className="text-sm text-error font-label-md">{error}</p>
      )}
    </div>
  );
}
