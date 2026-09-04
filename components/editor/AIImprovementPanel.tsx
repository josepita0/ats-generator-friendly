'use client';

import { useState } from 'react';
import type { ImprovementSuggestion } from '@/hooks/useSectionImprovement';

/* ── Types ───────────────────────────────────── */

interface AIImprovementPanelProps {
  suggestions: ImprovementSuggestion[];
  isAnalyzing: boolean;
  error: string | null;
  onAccept: (improved: string, index: number) => void;
  onEdit: (improved: string, index: number) => void;
  onDiscard: (index: number) => void;
  onClear: () => void;
}

/* ── Badge colors by suggestion type ─────────── */

const typeConfig: Record<
  ImprovementSuggestion['type'],
  { label: string; icon: string; color: string }
> = {
  verb: { label: 'Verbo de acción', icon: 'bolt', color: 'text-primary' },
  metric: { label: 'Métrica', icon: 'ssid_chart', color: 'text-success' },
  length: { label: 'Longitud', icon: 'format_size', color: 'text-tertiary' },
  keyword: { label: 'Keyword ATS', icon: 'key', color: 'text-warning' },
  clarity: { label: 'Claridad', icon: 'visibility', color: 'text-secondary' },
};

/* ── Component ───────────────────────────────── */

export function AIImprovementPanel({
  suggestions,
  isAnalyzing,
  error,
  onAccept,
  onEdit,
  onDiscard,
  onClear,
}: AIImprovementPanelProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  /* ── Loading state ────────────────────────────── */

  if (isAnalyzing) {
    return (
      <div className="mt-6 rounded-2xl border border-primary-container/30 bg-primary-container/5 p-5">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-primary text-[20px] animate-pulse">
            auto_awesome
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Analizando contenido con IA…
          </p>
        </div>
      </div>
    );
  }

  /* ── Error state ──────────────────────────────── */

  if (error) {
    return (
      <div className="mt-6 rounded-2xl border border-error/30 bg-error/5 p-5">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-error text-[20px]">
            error
          </span>
          <div>
            <p className="font-body-md text-body-md text-on-surface">
              No se pudo analizar el contenido
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Empty state ──────────────────────────────── */

  if (suggestions.length === 0) return null;

  /* ── Suggestions list ─────────────────────────── */

  return (
    <div className="mt-6 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">
            auto_awesome
          </span>
          Sugerencias de IA
          <span className="badge badge-primary ml-1">{suggestions.length}</span>
        </h3>
        <button
          type="button"
          onClick={onClear}
          className="btn-ghost text-[0.75rem] flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">close</span>
          Limpiar todo
        </button>
      </div>

      {/* Suggestion cards */}
      {suggestions.map((suggestion, index) => {
        const config = typeConfig[suggestion.type];

        return (
          <div
            key={`${suggestion.original.slice(0, 40)}-${index}`}
            className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 space-y-3"
          >
            {/* Type badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-surface-container-high rounded-full">
                <span className={`material-symbols-outlined text-[12px] ${config.color}`}>
                  {config.icon}
                </span>
                <span className="font-label-xs text-label-xs text-on-surface-variant">
                  {config.label}
                </span>
              </span>
            </div>

            {/* Original */}
            <div>
              <label className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider mb-1.5 block">
                Original
              </label>
              <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low p-3 rounded-xl leading-relaxed">
                {suggestion.original}
              </p>
            </div>

            {/* Improved */}
            <div>
              <label className="font-label-xs text-label-xs text-primary uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[12px]">
                  auto_awesome
                </span>
                Sugerencia mejorada
              </label>

              {editingIndex === index ? (
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full p-3 bg-surface-container-lowest border border-primary rounded-xl font-body-sm text-body-sm text-on-surface min-h-[80px] outline-none focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
              ) : (
                <p className="font-body-sm text-body-sm text-on-surface bg-primary-container/10 border border-primary-container/30 p-3 rounded-xl leading-relaxed">
                  {suggestion.improved}
                </p>
              )}
            </div>

            {/* Reason */}
            <div className="flex items-start gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px] mt-0.5">
                lightbulb
              </span>
              <p className="font-body-sm text-body-sm leading-relaxed">
                {suggestion.reason}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-outline-variant/30">
              {editingIndex === index ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onEdit(editValue, index);
                      setEditingIndex(null);
                    }}
                    className="btn-primary text-[0.75rem] flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">check</span>
                    Guardar cambios
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingIndex(null)}
                    className="btn-ghost text-[0.75rem]"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onAccept(suggestion.improved, index)}
                    className="btn-primary text-[0.75rem] flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">check</span>
                    Usar esta versión
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingIndex(index);
                      setEditValue(suggestion.improved);
                    }}
                    className="btn-secondary text-[0.75rem] flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                    Editar
                  </button>
                  <div className="flex-1" />
                  <button
                    type="button"
                    onClick={() => onDiscard(index)}
                    className="btn-ghost text-[0.75rem] flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                    Ignorar
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
