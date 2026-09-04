'use client';

export interface IndexabilityRule {
  id: string;
  label: string;
  description: string;
  passed: boolean;
}

interface Props {
  rules: IndexabilityRule[];
}

export function IndexabilityRules({ rules }: Props) {
  const passedCount = rules.filter((r) => r.passed).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[0.75rem] font-semibold text-on-surface font-label-sm uppercase tracking-wider">
          Indexabilidad
        </h3>
        <span className="badge badge-success">
          {passedCount}/{rules.length} Verificadas
        </span>
      </div>
      <ul className="space-y-2.5">
        {rules.map((rule) => (
          <li key={rule.id} className="flex items-start gap-2.5">
            <span
              className={`material-symbols-outlined text-[18px] mt-px shrink-0 ${
                rule.passed ? 'text-primary' : 'text-error'
              }`}
            >
              {rule.passed ? 'check_circle' : 'cancel'}
            </span>
            <div className="min-w-0">
              <p className="text-[0.75rem] font-semibold text-on-surface leading-tight">
                {rule.label}
              </p>
              <p className="text-[0.625rem] text-on-surface-variant leading-snug mt-0.5">
                {rule.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
