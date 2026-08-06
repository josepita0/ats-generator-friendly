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
        return 'TRANSLATE';
    }
  };

  if (mobile) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowDirectionPicker(!showDirectionPicker)}
          disabled={state === 'translating'}
          className="px-btn-teal w-10 h-10 flex items-center justify-center p-0"
        >
          <svg className="w-5 h-5 text-[#06132E]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.91-4.33-3.56zm2.95-8H5.08c.96-1.65 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
          </svg>
        </button>

        {showDirectionPicker && (
          <div className="absolute top-full right-0 mt-2 bg-[#0E4A57] rounded-lg border-2 border-[#F86B2A] p-3 shadow-[4px_4px_0_#06132E] z-[90] min-w-[160px]">
            <p className="text-[#FFF3D5] font-label-md font-bold text-[10px] mb-2 text-center uppercase">
              {dict.translate.direction}
            </p>
            <div className="flex flex-col gap-1.5 mb-2">
              <button
                type="button"
                onClick={() => { setDirection('es-to-en'); setShowDirectionPicker(false); handleTranslate(); }}
                disabled={state === 'translating'}
                className={`px-btn-orange text-[10px] py-1.5 px-3 ${direction === 'es-to-en' ? 'ring-2 ring-[#FFC329]' : ''}`}
              >
                {dict.translate.esToEn}
              </button>
              <button
                type="button"
                onClick={() => { setDirection('en-to-es'); setShowDirectionPicker(false); handleTranslate(); }}
                disabled={state === 'translating'}
                className={`px-btn-teal text-[10px] py-1.5 px-3 ${direction === 'en-to-es' ? 'ring-2 ring-[#FFC329]' : ''}`}
              >
                {dict.translate.enToEs}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowDirectionPicker(false)}
              className="px-pill text-[9px] w-full"
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
          <svg className="w-4 h-4 text-[#06132E]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.91-4.33-3.56zm2.95-8H5.08c.96-1.65 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
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
