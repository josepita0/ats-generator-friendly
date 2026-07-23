'use client';

import { useState, useRef } from 'react';
import { extractTextFromPDF } from '@/lib/pdf';
import { CVData } from '@/types/cv';
import { Dictionary } from '@/lib/i18n/dictionaries';

interface Props {
  onImport: (data: CVData) => void;
  dict: Dictionary;
}

type ImportState = 'idle' | 'extracting' | 'parsing' | 'success' | 'error';

export function PdfImporter({ onImport, dict }: Props) {
  const [state, setState] = useState<ImportState>('idle');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setState('extracting');
    setError('');

    try {
      const text = await extractTextFromPDF(file);
      setState('parsing');

      const response = await fetch('/api/ai/parse-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to parse PDF');
      }

      const parsedData: CVData = await response.json();
      setState('success');
      onImport(parsedData);

      setTimeout(() => setState('idle'), 2000);
    } catch (err) {
      console.error('Import error:', err);
      setState('error');
      const message = err instanceof Error ? err.message : dict.pdfImporter.error;
      if (message.includes('AI not configured') || message.includes('AI no configurada')) {
        setError(dict.pdfImporter.notConfigured);
      } else {
        setError(message);
      }
    }
  };

  const getButtonText = () => {
    switch (state) {
      case 'extracting':
        return dict.pdfImporter.extracting;
      case 'parsing':
        return dict.pdfImporter.parsing;
      case 'success':
        return dict.pdfImporter.success;
      case 'error':
        return dict.pdfImporter.tryAgain;
      default:
        return dict.form.importPdf;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={state === 'extracting' || state === 'parsing'}
        className="flex items-center gap-2 bg-surface-variant text-on-surface px-6 py-4 font-label-md font-bold rounded-full retro-border hover:bg-surface-bright transition-colors disabled:opacity-50"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        {getButtonText()}
      </button>
      {state === 'idle' && (
        <p className="text-sm text-on-surface-variant font-label-md">{dict.pdfImporter.dropzone}</p>
      )}
      {state === 'error' && (
        <p className="text-sm text-red-400 font-label-md">{error}</p>
      )}
    </div>
  );
}
