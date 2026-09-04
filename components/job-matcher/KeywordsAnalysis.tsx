'use client';

interface Props {
  foundKeywords: string[];
  missingKeywords: string[];
}

export function KeywordsAnalysis({ foundKeywords, missingKeywords }: Props) {
  return (
    <div className="space-y-4">
      {/* Found keywords */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-title-md text-[0.875rem] font-semibold text-on-surface">
            Keywords encontradas en tu CV
          </h3>
          <span className="badge badge-success">
            {foundKeywords.length} detectadas
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {foundKeywords.map((kw) => (
            <span
              key={kw}
              className="chip chip-active flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[0.75rem]">check</span>
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Missing keywords */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-title-md text-[0.875rem] font-semibold text-on-surface">
            Keywords críticas sugeridas / faltantes
          </h3>
          <span className="badge badge-warning">
            {missingKeywords.length} faltantes en tu CV
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.map((kw) => (
            <span
              key={kw}
              className="chip chip-inactive flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[0.75rem] text-error">
                add_circle
              </span>
              {kw}
            </span>
          ))}
        </div>
        {missingKeywords.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px] text-primary">
              recommendation
            </span>
            <span className="font-label-xs text-[0.6875rem] text-primary font-semibold uppercase tracking-wider">
              Recomendado añadir
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
