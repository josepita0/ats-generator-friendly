'use client';

export function PrivacyInfoCard() {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-[18px] text-primary">
          shield_lock
        </span>
        <h3 className="font-title-md text-[0.875rem] font-semibold text-on-surface">
          Procesamiento Local Directo & Privacidad
        </h3>
      </div>

      <p className="font-body-sm text-[0.8125rem] text-on-surface-variant leading-relaxed mb-3">
        Tu descripción de vacante se envía directamente a la API de Gemini sin
        pasar por servidores intermedios. No se almacena ningún dato en bases
        externas.
      </p>

      <div className="flex flex-wrap gap-2">
        <span className="badge badge-success">
          <span className="material-symbols-outlined text-[0.5rem]">check</span>
          Direct Client-to-API
        </span>
        <span className="badge badge-success">
          <span className="material-symbols-outlined text-[0.5rem]">check</span>
          Zero Retention
        </span>
      </div>
    </div>
  );
}
