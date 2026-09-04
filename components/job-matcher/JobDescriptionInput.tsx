'use client';

import { EXAMPLE_JOB_DESCRIPTION } from '@/types/job-matcher';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onExtractEntities?: () => void;
  isExtracting?: boolean;
  characterCount: number;
  requirementCount: number;
}

export function JobDescriptionInput({
  value,
  onChange,
  onExtractEntities,
  isExtracting = false,
  characterCount,
  requirementCount,
}: Props) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-title-md text-[0.9375rem] font-semibold text-on-surface">
          Descripción de la Vacante
        </h2>
        <span className="badge badge-success">
          <span className="material-symbols-outlined text-[0.5rem]">check</span>
          Gemini 1.5 Flash
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
        <button
          type="button"
          onClick={() => onChange(EXAMPLE_JOB_DESCRIPTION)}
          className="btn-secondary flex items-center gap-2 text-[0.8125rem]"
        >
          <span className="material-symbols-outlined text-[16px]">science</span>
          Cargar ejemplo
        </button>
        <button
          type="button"
          className="btn-secondary flex items-center gap-2 text-[0.8125rem]"
          onClick={() => {
            // TODO: Implement PDF/LinkedIn import
            console.log('Import job offer');
          }}
        >
          <span className="material-symbols-outlined text-[16px]">upload_file</span>
          Importar oferta
        </button>
      </div>

      {/* PDF/LinkedIn hint */}
      <div className="mt-3 p-3 rounded-2xl bg-surface-container-low border border-hairline">
        <p className="text-on-surface-variant font-body-sm text-[0.8125rem]">
          ¿Tenés un PDF o link de LinkedIn?
        </p>
        <button
          type="button"
          className="btn-ghost flex items-center gap-2 text-[0.75rem] mt-1 px-0"
          onClick={() => {
            // TODO: Implement offer import
            console.log('Import offer from PDF/LinkedIn');
          }}
        >
          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          Importar oferta directamente
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
