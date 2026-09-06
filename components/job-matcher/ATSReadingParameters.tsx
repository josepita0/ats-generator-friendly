'use client';

import { useCVStore, type ATSTone, type GeminiModel } from '@/stores/cvStore';

interface ATSParameter {
  icon: string;
  label: string;
  value: string;
  variant: 'success' | 'info';
}

const TONE_DISPLAY: Record<ATSTone, string> = {
  quantitative: 'Cuantitativo ATS',
  concise: 'Conciso Directo',
  executive: 'Ejecutivo C-Level',
};

const MODEL_DISPLAY: Record<GeminiModel, string> = {
  flash: 'Gemini 3.6 Flash',
  pro: 'Gemini 2.5 Pro',
};

const DEFAULT_PARAMETERS: ATSParameter[] = [
  {
    icon: 'check_circle',
    label: 'Compatibilidad Workday/Taleo',
    value: 'Óptimo',
    variant: 'success',
  },
  {
    icon: 'check_circle',
    label: 'Densidad de términos clave (2.4%)',
    value: 'Equilibrada',
    variant: 'success',
  },
  {
    icon: 'info',
    label: 'Formato cronológico inverso',
    value: 'Estándar',
    variant: 'info',
  },
];

export function ATSReadingParameters() {
  const atsTone = useCVStore((s) => s.atsTone);
  const selectedModel = useCVStore((s) => s.selectedModel);

  const dynamicParameters: ATSParameter[] = [
    {
      icon: 'smart_toy',
      label: 'Modelo de inferencia',
      value: MODEL_DISPLAY[selectedModel],
      variant: 'info',
    },
    {
      icon: 'tune',
      label: 'Tono de redacción',
      value: TONE_DISPLAY[atsTone],
      variant: 'info',
    },
    ...DEFAULT_PARAMETERS,
  ];

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-[18px] text-primary">
          tune
        </span>
        <h3 className="font-title-md text-[0.875rem] font-semibold text-on-surface">
          Parámetros de Lectura ATS
        </h3>
      </div>

      <div className="space-y-2">
        {dynamicParameters.map((param) => (
          <div
            key={param.label}
            className="flex items-center justify-between py-1.5"
          >
            <div className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-[16px] ${
                  param.variant === 'success' ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {param.icon}
              </span>
              <span className="font-body-sm text-[0.8125rem] text-on-surface">
                {param.label}
              </span>
            </div>
            <span className="font-label-sm text-[0.75rem] font-semibold text-primary">
              {param.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
