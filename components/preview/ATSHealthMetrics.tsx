'use client';

interface Props {
  score: number;
  label: string;
  description?: string;
}

function getScoreColor(score: number): string {
  if (score >= 90) return '#21422d';
  if (score >= 70) return '#8a6d00';
  return '#ba1a1a';
}

function getScoreBg(score: number): string {
  if (score >= 90) return 'rgba(170, 208, 179, 0.25)';
  if (score >= 70) return 'rgba(219, 229, 219, 0.5)';
  return 'rgba(255, 218, 214, 0.5)';
}

export function ATSHealthMetrics({ score, label, description }: Props) {
  const radius = 36;
  const stroke = 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);
  const bg = getScoreBg(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[88px] h-[88px]">
        <svg
          viewBox="0 0 88 88"
          className="w-full h-full -rotate-90"
        >
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke={bg}
            strokeWidth={stroke}
          />
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-[1.375rem] font-bold font-title-md leading-none"
            style={{ color }}
          >
            {score}
          </span>
          <span className="text-[0.5625rem] text-on-surface-variant font-label-xs leading-none mt-0.5">
            /100
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[0.75rem] font-semibold text-on-surface font-label-sm">
          {label}
        </p>
        {description && (
          <p className="text-[0.625rem] text-on-surface-variant font-label-xs mt-0.5">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
