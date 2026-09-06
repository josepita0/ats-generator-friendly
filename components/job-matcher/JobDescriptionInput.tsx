'use client';

import { useRef, useState, useCallback } from 'react';
import { useCVStore, type GeminiModel } from '@/stores/cvStore';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onExtractEntities?: () => void;
  isExtracting?: boolean;
  characterCount: number;
  requirementCount: number;
}

const MODEL_DISPLAY_NAMES: Record<GeminiModel, string> = {
  flash: 'Gemini 3.6 Flash',
  pro: 'Gemini 2.5 Pro',
};

export function JobDescriptionInput({
  value,
  onChange,
  onExtractEntities,
  isExtracting = false,
  characterCount,
  requirementCount,
}: Props) {
  const selectedModel = useCVStore((s) => s.selectedModel);
  const apiKey = useCVStore((s) => s.apiKey);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImportingPdf, setIsImportingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const handlePdfUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!apiKey) {
        setPdfError('Configure tu API key de Gemini primero');
        return;
      }

      setIsImportingPdf(true);
      setPdfError(null);

      try {
        // Read file as ArrayBuffer and convert to base64
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);

        const response = await fetch('/api/ai/extract-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pdfBase64: base64,
            apiKey,
            model: selectedModel,
          }),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(
            body?.error || `Error al extraer texto del PDF (${response.status})`,
          );
        }

        const result = await response.json();
        if (result.text) {
          onChange(result.text);
        } else {
          throw new Error('No se pudo extraer texto del PDF');
        }
      } catch (err) {
        setPdfError(
          err instanceof Error ? err.message : 'Error al procesar el PDF',
        );
      } finally {
        setIsImportingPdf(false);
        // Reset file input so the same file can be re-selected
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [apiKey, selectedModel, onChange],
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-title-md text-[0.9375rem] font-semibold text-on-surface">
          Descripción de la Vacante
        </h2>
        <span className="badge badge-success">
          <span className="material-symbols-outlined text-[0.5rem]">check</span>
          {MODEL_DISPLAY_NAMES[selectedModel]}
        </span>
      </div>

      <textarea
        className="input-field min-h-[320px] resize-y custom-scroll"
        placeholder="Pegá la descripción de la vacante o los requisitos ATS..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Descripción de la vacante"
      />

      {/* Stats bar */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-4 text-on-surface-variant font-label-xs">
          <span>{characterCount.toLocaleString()} caracteres</span>
          <span className="w-px h-3 bg-outline-variant" />
          <span>• {requirementCount} requerimientos</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handlePdfUpload}
          className="hidden"
          ref={fileInputRef}
          aria-label="Seleccionar PDF de oferta laboral"
        />
        <button
          type="button"
          className="btn-secondary flex items-center gap-2 text-[0.8125rem]"
          disabled={isImportingPdf}
          onClick={() => fileInputRef.current?.click()}
        >
          <span className={`material-symbols-outlined text-[16px] ${isImportingPdf ? 'animate-spin' : ''}`}>
            {isImportingPdf ? 'progress_activity' : 'upload_file'}
          </span>
          {isImportingPdf ? 'Importando...' : 'Importar oferta'}
        </button>
      </div>

      {/* PDF import error */}
      {pdfError && (
        <div className="mt-3 p-3 rounded-2xl bg-error/5 border border-error/30">
          <p className="font-body-sm text-[0.8125rem] text-error">
            {pdfError}
          </p>
        </div>
      )}

      {/* PDF/LinkedIn hint */}
      <div className="mt-3 p-3 rounded-2xl bg-surface-container-low border border-hairline">
        <p className="text-on-surface-variant font-body-sm text-[0.8125rem]">
          ¿Tenés un PDF de la oferta?
        </p>
        <button
          type="button"
          className="btn-ghost flex items-center gap-2 text-[0.75rem] mt-1 px-0"
          disabled={isImportingPdf}
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          Importar oferta desde PDF
        </button>
      </div>

      {/* Extract entities toggle */}
      <div className="flex items-center justify-between mt-4 p-3 rounded-2xl bg-surface-container-low border border-hairline">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary">
            account_tree
          </span>
          <span className="font-body-sm text-[0.8125rem] text-on-surface">
            Extraer entidades técnicas
          </span>
        </div>
        <button
          type="button"
          onClick={onExtractEntities}
          disabled={!value.trim() || isExtracting}
          className={`w-10 h-6 rounded-full transition-colors relative ${
            isExtracting
              ? 'bg-primary-container animate-pulse'
              : value.trim()
                ? 'bg-primary-container cursor-pointer'
                : 'bg-surface-container-high'
          }`}
          aria-label="Extraer entidades técnicas"
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-on-primary transition-transform shadow-sm ${
              isExtracting || value.trim() ? 'translate-x-[18px]' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
