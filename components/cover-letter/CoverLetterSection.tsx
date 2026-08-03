'use client';

import { useState, useCallback, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import type { CVData } from '@/types/cv';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { saveCoverLetter, loadCoverLetter } from '@/lib/storage';
import { CoverLetterDocument } from '@/components/pdf/CoverLetterDocument';
import { CoverLetterPreview } from './CoverLetterPreview';

interface Props {
  dict: Dictionary;
  getCvData: () => CVData;
  jobDescription: string;
  language: 'es' | 'en';
}

type GenerateState = 'idle' | 'generating' | 'done' | 'error';

function getInitialLetter() {
  if (typeof window === 'undefined') return { es: '', en: '' };
  return loadCoverLetter() || { es: '', en: '' };
}

export function CoverLetterSection({ dict, getCvData, jobDescription, language }: Props) {
  const initialLetter = getInitialLetter();
  const [bodyEs, setBodyEs] = useState(initialLetter.es);
  const [bodyEn, setBodyEn] = useState(initialLetter.en);
  const [state, setState] = useState<GenerateState>(
    initialLetter.es || initialLetter.en ? 'done' : 'idle'
  );
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const currentBody = language === 'es' ? bodyEs : bodyEn;
  const setCurrentBody = language === 'es' ? setBodyEs : setBodyEn;

  useEffect(() => {
    if (state === 'done') {
      saveCoverLetter({ es: bodyEs, en: bodyEn });
    }
  }, [bodyEs, bodyEn, state]);

  const handleBodyChange = useCallback(
    (value: string) => {
      setCurrentBody(value);
      setState('done');
    },
    [setCurrentBody]
  );

  const handleGenerate = useCallback(async () => {
    setState('generating');
    setError('');

    try {
      const currentCv = getCvData();
      const response = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvData: currentCv,
          jobDescription: jobDescription || undefined,
          language,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || dict.coverLetter.error);
      }

      const result = await response.json();
      setCurrentBody(result.letter);
      setState('done');
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : dict.coverLetter.error);
    }
  }, [getCvData, jobDescription, language, dict, setCurrentBody]);

  const handleDownloadPDF = useCallback(async () => {
    const currentCv = getCvData();
    const blob = await pdf(
      <CoverLetterDocument
        personalInfo={currentCv.personalInfo}
        body={currentBody}
        language={language}
        dict={dict}
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentCv.personalInfo.name.replace(/\s+/g, '_')}_Cover_Letter.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [getCvData, currentBody, language, dict]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(currentBody);
  }, [currentBody]);

  const getButtonText = () => {
    switch (state) {
      case 'generating':
        return dict.coverLetter.processing;
      case 'done':
        return currentBody ? dict.coverLetter.regenerate : dict.coverLetter.generate;
      default:
        return dict.coverLetter.generate;
    }
  };

  const isDone = state === 'done' && currentBody.length > 0;

  return (
    <div className="rounded bg-surface-container retro-border p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-on-surface font-headline-md font-bold text-lg flex items-center gap-2">
          <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z" />
          </svg>
          {dict.coverLetter.title}
        </h3>
        <div className="flex items-center gap-2">
          {isDone && (
            <>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className={`text-xs px-3 py-1 rounded-full font-label-md transition-colors cursor-pointer ${
                  showPreview
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-surface-bright text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {dict.coverLetter.preview}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs px-3 py-1 rounded-full font-label-md bg-surface-bright text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                {dict.coverLetter.copy}
              </button>
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="text-xs px-3 py-1 rounded-full font-label-md font-bold bg-secondary text-on-secondary hover:opacity-90 transition-opacity cursor-pointer"
              >
                {dict.coverLetter.downloadPdf}
              </button>
            </>
          )}
        </div>
      </div>

      <div className={`gap-4 ${isDone && showPreview ? 'grid grid-cols-1 md:grid-cols-2' : ''}`}>
        <div>
          {!isDone && state !== 'generating' && (
            <p className="text-sm text-on-surface mb-4">
              {dict.coverLetter.emptyHint}
            </p>
          )}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={state === 'generating'}
            className="flex items-center gap-2 bg-surface-variant text-on-surface px-6 py-3 font-label-md font-bold rounded-full retro-border hover:bg-surface-bright transition-colors disabled:opacity-50 cursor-pointer mb-4"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {getButtonText()}
          </button>

          {state === 'generating' && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-on-surface-variant animate-pulse">{dict.coverLetter.processing}</span>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 font-label-md mb-4">{error}</p>
          )}

          {isDone && (
            <textarea
              value={currentBody}
              onChange={(e) => handleBodyChange(e.target.value)}
              rows={16}
              className="retro-input w-full p-4 text-sm font-mono resize-y"
              aria-label={dict.coverLetter.placeholder}
              placeholder={dict.coverLetter.placeholder}
            />
          )}
        </div>

        {isDone && showPreview && (
          <div className="min-h-[400px] max-h-[600px]">
            <CoverLetterPreview
              personalInfo={getCvData().personalInfo}
              body={currentBody}
              language={language}
            />
          </div>
        )}
      </div>
    </div>
  );
}
