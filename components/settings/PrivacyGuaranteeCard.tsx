'use client';

export function PrivacyGuaranteeCard() {
  return (
    <div className="card">
      <div className="flex items-start gap-4 mb-5">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-[1.5rem] text-primary">
            shield_lock
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-title-md text-[1rem] font-semibold text-on-surface">
              100% Client-Side &amp; Privado
            </h3>
            <span className="badge badge-success">
              <span className="material-symbols-outlined text-[0.625rem]">
                check
              </span>
              Zero Log
            </span>
          </div>
          <p className="font-body-sm text-on-surface-variant">
            Tus datos nunca salen de tu navegador. Sin servidores, sin
            rastreadores, sin compromisos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-surface-container-low/70 rounded-2xl p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-[1.25rem] text-primary mt-0.5">
            memory
          </span>
          <div>
            <p className="font-label-sm font-semibold text-on-surface mb-0.5">
              Peticiones HTTPS directas a Gemini
            </p>
            <p className="font-body-xs text-on-surface-variant">
              Conexión cifrada punto a punto
            </p>
          </div>
        </div>

        <div className="bg-surface-container-low/70 rounded-2xl p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-[1.25rem] text-primary mt-0.5">
            cookie_off
          </span>
          <div>
            <p className="font-label-sm font-semibold text-on-surface mb-0.5">
              Cero cookies de analítica o rastreadores
            </p>
            <p className="font-body-xs text-on-surface-variant">
              Sin telemetría externa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
