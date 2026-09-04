'use client';

import { useState, useRef } from 'react';
import { extractTextFromPDF } from '@/lib/pdf';
import { CVData } from '@/types/cv';
import { Dictionary } from '@/lib/i18n/dictionaries';

interface Props {
  onImport: (data: CVData) => void;
  dict: Dictionary;
  compact?: boolean;
  mobile?: boolean;
}

type ImportState = 'idle' | 'extracting' | 'parsing' | 'success' | 'error';

export function PdfImporter({ onImport, dict, compact = false, mobile = false }: Props) {
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
        return dict.pdfImporter.title;
    }
  };

  const isDisabled = state === 'extracting' || state === 'parsing';

  if (mobile) {
    return (
      <div className="relative">
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
          disabled={isDisabled}
          className="btn-secondary w-10 h-10 flex items-center justify-center p-0 !rounded-full"
          title={isDisabled ? getButtonText() : undefined}
        >
          <span className={`material-symbols-outlined text-[18px] ${isDisabled ? 'animate-pulse text-primary' : ''}`}>
            {isDisabled ? 'hourglass_empty' : 'upload_file'}
          </span>
        </button>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="relative group">
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
          disabled={isDisabled}
          className={`btn-secondary flex items-center gap-1.5 text-[0.8125rem] ${isDisabled ? 'ring-2 ring-primary/30' : ''}`}
        >
          <span className={`material-symbols-outlined text-[16px] ${isDisabled ? 'animate-pulse text-primary' : ''}`}>
            {isDisabled ? 'hourglass_empty' : 'upload_file'}
          </span>
          {getButtonText()}
        </button>
        {/* Tooltip on error */}
        {state === 'error' && (
          <p className="absolute top-full left-0 mt-1 text-[10px] text-error font-label-xs whitespace-nowrap z-10 bg-surface-container-lowest px-2 py-1 rounded shadow-lg">
            {error}
          </p>
        )}
      </div>
    );
  }

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
        disabled={isDisabled}
        className={`btn-secondary flex items-center gap-2 py-3 px-5 ${isDisabled ? 'ring-2 ring-primary/30' : ''}`}
      >
        <span className={`material-symbols-outlined text-[20px] ${isDisabled ? 'animate-pulse text-primary' : ''}`}>
          {isDisabled ? 'hourglass_empty' : 'upload_file'}
        </span>
        {getButtonText()}
      </button>
      {state === 'idle' && (
        <p className="text-sm text-on-surface-variant font-label-md">{dict.pdfImporter.dropzone}</p>
      )}
      {state === 'error' && (
        <p className="text-sm text-error font-label-md">{error}</p>
      )}
    </div>
  );
}
