'use client';

interface ScoreMetric {
  label: string;
  percentage: number;
}

interface Props {
  matchScore: number;
  technicalMatch: number;
  atsStructure: number;
  softSkillsMatch: number;
}

function ScoreCircle({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="var(--color-surface-container)"
          strokeWidth="8"
        />
        {/* Score arc */}
        <circle
          cx="50"
          cy="50"
          r="45"
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
        <span className="font-headline-xl text-[2rem] font-semibold text-on-surface leading-none">
          {score}%
        </span>
        <span className="font-label-xs text-on-surface-variant mt-0.5">Match</span>
      </div>
    </div>
  );
}

function MetricBar({ label, percentage }: ScoreMetric) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="font-body-sm text-[0.8125rem] text-on-surface-variant">
          {label}
        </span>
        <span className="font-label-sm text-[0.75rem] font-semibold text-on-surface">
          {percentage}%
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function MatchScoreCard({
  matchScore,
  technicalMatch,
  atsStructure,
  softSkillsMatch,
}: Props) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-[18px] text-primary">
          analytics
        </span>
        <h3 className="font-title-md text-[0.9375rem] font-semibold text-on-surface">
          Diagnóstico de Compatibilidad
        </h3>
      </div>

      <ScoreCircle score={matchScore} />

      {/* Score label */}
      <div className="text-center mt-3 mb-4">
        <p className="font-title-sm text-[0.8125rem] font-semibold text-primary">
          {matchScore >= 75
            ? 'Calificación ATS Fuerte'
            : matchScore >= 50
              ? 'Calificación ATS Moderada'
              : 'Calificación ATS Baja'}
        </p>
        <p className="font-body-sm text-[0.75rem] text-on-surface-variant">
          Potencial de entrevista{' '}
          {matchScore >= 75 ? 'alto' : matchScore >= 50 ? 'medio' : 'bajo'}
        </p>
      </div>

      {/* Detailed metrics */}
      <div className="space-y-3">
        <MetricBar label="Match Técnico" percentage={technicalMatch} />
        <MetricBar label="Estructura ATS" percentage={atsStructure} />
        <MetricBar label="Req. Blandos / Liderazgo" percentage={softSkillsMatch} />
      </div>
    </div>
  );
}
