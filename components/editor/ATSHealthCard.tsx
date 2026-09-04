"use client";

interface Props {
  score: number;
}

const METRICS = [
  { label: "Single Column", value: 100 },
  { label: "Sin imágenes", value: 100 },
  { label: "Fuentes estándar", value: 100 },
  { label: "Texto seleccionable", value: 100 },
];

export function ATSHealthCard({ score }: Props) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;

  const scoreColor =
    score >= 90
      ? "text-primary"
      : score >= 70
        ? "text-tertiary"
        : "text-error";

  return (
    <div className="card">
      <p className="section-label mb-3">Salud del Formato ATS</p>

      {/* Donut chart */}
      <div className="flex items-center justify-center mb-3">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--color-surface-container)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--color-primary-container)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-display-lg text-xl font-bold ${scoreColor}`}>
              {score}
            </span>
            <span className="text-on-surface-variant text-[0.5rem] font-label-xs">
              /100
            </span>
          </div>
        </div>
      </div>

      {/* Progress bars */}
      <div className="space-y-2">
        {METRICS.map((m) => (
          <div key={m.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-on-surface-variant text-[0.625rem] font-label-xs">
                {m.label}
              </span>
              <span className="text-on-surface text-[0.625rem] font-label-xs font-semibold">
                {m.value}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${m.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation badge */}
      <div className="mt-3 flex items-center gap-1.5 p-2.5 rounded-xl bg-secondary-container/50">
        <span className="material-symbols-outlined text-[16px] text-primary">
          auto_awesome
        </span>
        <p className="text-on-surface-variant text-[0.625rem] font-label-xs leading-snug">
          Gemini recomienda agregar keywords del puesto para mejorar el ATS
          score.
        </p>
      </div>
    </div>
  );
}
