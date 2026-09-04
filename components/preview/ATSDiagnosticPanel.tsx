'use client';

import { ATSHealthMetrics } from '@/components/preview/ATSHealthMetrics';
import {
  IndexabilityRules,
  type IndexabilityRule,
} from '@/components/preview/IndexabilityRules';
import {
  LayoutParameters,
  type PaperSize,
  type MarginPreset,
  type FontScale,
} from '@/components/preview/LayoutParameters';

interface ProgressMetric {
  label: string;
  percentage: number;
}

interface Props {
  overallScore: number;
  progressMetrics: ProgressMetric[];
  indexabilityRules: IndexabilityRule[];
  suggestedKeywords: string[];
  onApplyKeywords: () => void;
  onOptimizeWithAI: () => void;
  onExportJSON: () => void;
  paperSize: PaperSize;
  onPaperSizeChange: (v: PaperSize) => void;
  marginPreset: MarginPreset;
  onMarginPresetChange: (v: MarginPreset) => void;
  fontScale: FontScale;
  onFontScaleChange: (v: FontScale) => void;
}

function ProgressBar({ label, percentage }: ProgressMetric) {
  const barColor =
    percentage >= 90
      ? 'bg-primary-container'
      : percentage >= 70
        ? 'bg-[#8a6d00]'
        : 'bg-error';

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[0.6875rem] text-on-surface-variant font-label-xs">
          {label}
        </span>
        <span className="text-[0.6875rem] font-semibold text-on-surface font-label-xs">
          {percentage}%
        </span>
      </div>
      <div className="progress-bar">
        <div
          className={`progress-bar-fill ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function ATSDiagnosticPanel({
  overallScore,
  progressMetrics,
  indexabilityRules,
  suggestedKeywords,
  onApplyKeywords,
  onOptimizeWithAI,
  onExportJSON,
  paperSize,
  onPaperSizeChange,
  marginPreset,
  onMarginPresetChange,
  fontScale,
  onFontScaleChange,
}: Props) {
  return (
    <div className="space-y-5">
      {/* Overall score */}
      <div className="card flex flex-col items-center py-5">
        <ATSHealthMetrics
          score={overallScore}
          label="Formato ATS Válido"
          description="Tu CV cumple con los estándares ATS"
        />
      </div>

      {/* Progress metrics */}
      <div className="card">
        <h3 className="text-[0.75rem] font-semibold text-on-surface font-label-sm uppercase tracking-wider mb-3">
          Métricas de Calidad
        </h3>
        <div className="space-y-3">
          {progressMetrics.map((m) => (
            <ProgressBar key={m.label} {...m} />
          ))}
        </div>

        {/* Suggested keywords */}
        {suggestedKeywords.length > 0 && (
          <div className="mt-4 pt-3 border-t border-outline-variant/30">
            <p className="text-[0.6875rem] text-on-surface-variant font-label-xs mb-2">
              Keywords sugeridas
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {suggestedKeywords.map((kw) => (
                <span key={kw} className="chip chip-inactive text-[0.625rem]">
                  {kw}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={onApplyKeywords}
              className="btn-secondary text-[0.75rem] w-full flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              Aplicar keywords
            </button>
          </div>
        )}
      </div>

      {/* Indexability rules */}
      <div className="card">
        <IndexabilityRules rules={indexabilityRules} />
      </div>

      {/* Layout parameters */}
      <div className="card">
        <LayoutParameters
          paperSize={paperSize}
          onPaperSizeChange={onPaperSizeChange}
          marginPreset={marginPreset}
          onMarginPresetChange={onMarginPresetChange}
          fontScale={fontScale}
          onFontScaleChange={onFontScaleChange}
        />
      </div>

      {/* Action buttons */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onOptimizeWithAI}
          className="btn-secondary flex items-center gap-2 w-full justify-center"
        >
          <span className="material-symbols-outlined text-[16px]">
            auto_awesome
          </span>
          Optimizar con Gemini
        </button>
        <button
          type="button"
          onClick={onExportJSON}
          className="btn-ghost flex items-center gap-2 w-full justify-center text-[0.8125rem]"
        >
          <span className="material-symbols-outlined text-[16px]">code</span>
          Exportar JSON
        </button>
      </div>
    </div>
  );
}
