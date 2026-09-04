'use client';

export function PrivacyFooterBadge() {
  return (
    <div className="card bg-surface-container-low/50">
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-[1.25rem] text-primary mt-0.5">
          verified
        </span>
        <p className="font-body-sm text-on-surface-variant">
          Arquitectura compatible con GDPR, CCPA y normativas europeas al
          operar con ejecución 0-servidor.
        </p>
      </div>
    </div>
  );
}
