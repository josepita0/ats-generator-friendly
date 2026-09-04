'use client';

import type { BulletSuggestion as BulletSuggestionType } from '@/types/job-matcher';

interface Props {
  suggestion: BulletSuggestionType;
  onRegenerate?: () => void;
  onEditManual?: () => void;
  onDiscard?: () => void;
  onAccept?: () => void;
}

export function BulletSuggestionCard({
  suggestion,
  onRegenerate,
  onEditManual,
  onDiscard,
  onAccept,
}: Props) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-title-md text-[0.875rem] font-semibold text-on-surface">
          Sugerencia de Adaptación de Viñeta
        </h3>
        <div className="flex items-center gap-2">
          <span className="badge badge-success">
            <span className="material-symbols-outlined text-[0.5rem]">check</span>
            +{suggestion.matchPointsGained} Pts Match ATS
          </span>
          <span className="badge badge-success">
            <span className="material-symbols-outlined text-[0.5rem]">verified</span>
            Validado 100%
          </span>
        </div>
      </div>

      {/* Comparison columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Original */}
        <div className="p-3 rounded-2xl bg-surface-container-low border border-hairline">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-label-xs text-[0.6875rem] text-on-surface-variant uppercase tracking-wider font-semibold">
              Viñeta Original en tu CV
            </span>
          </div>
          <p className="font-body-sm text-[0.8125rem] text-on-surface leading-relaxed">
            {suggestion.originalText}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-label-xs text-[0.6875rem] text-on-surface-variant">
              {suggestion.position}
            </span>
            <span className="w-1 h-1 rounded-full bg-outline-variant" />
            <span className="font-label-xs text-[0.6875rem] text-on-surface-variant">
              {suggestion.period}
            </span>
          </div>
        </div>

        {/* Adapted */}
        <div className="p-3 rounded-2xl bg-primary-fixed/30 border border-primary-fixed/50">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[12px] text-primary">
              auto_awesome
            </span>
            <span className="font-label-xs text-[0.6875rem] text-primary uppercase tracking-wider font-semibold">
              Adaptada ATS con Gemini
            </span>
          </div>
          <p className="font-body-sm text-[0.8125rem] text-on-surface leading-relaxed">
            {suggestion.adaptedText}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-label-xs text-[0.6875rem] text-primary">
              Keywords integradas orgánicamente: {suggestion.keywordsIntegrated}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
        <button
          type="button"
          onClick={onRegenerate}
          className="btn-secondary flex items-center gap-2 text-[0.8125rem]"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          Regenerar con Gemini
        </button>
        <button
          type="button"
          onClick={onEditManual}
          className="btn-ghost flex items-center gap-2 text-[0.8125rem]"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
          Editar manualmente
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={onDiscard}
          className="btn-ghost flex items-center gap-2 text-[0.8125rem]"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
          Descartar
        </button>
        <button
          type="button"
          onClick={onAccept}
          className="btn-primary flex items-center gap-2 text-[0.8125rem]"
        >
          <span className="material-symbols-outlined text-[16px]">check</span>
          Aceptar cambio en CV
        </button>
      </div>
    </div>
  );
}
