'use client';

import { useState } from 'react';

interface Props {
  storageUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  onClearStorage: () => void;
}

export function StorageQuotaCard({ storageUsage, onClearStorage }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClear = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    onClearStorage();
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div className="card">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-[1.5rem] text-primary">
            pie_chart
          </span>
        </div>
        <div className="flex-1">
          <h3 className="font-title-md text-[1rem] font-semibold text-on-surface mb-0.5">
            Zona de Reinicio &amp; Cuota
          </h3>
          <p className="font-body-sm text-on-surface-variant">
            Capacidad física en este navegador
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-label-sm text-on-surface-variant">
            Almacenamiento
          </span>
          <span className="font-label-sm font-semibold text-on-surface">
            {storageUsage.percentage}% usado
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${storageUsage.percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-body-xs text-on-surface-variant">
            {storageUsage.used} MB ocupados
          </span>
          <span className="font-body-xs text-on-surface-variant">
            ~{storageUsage.total} MB disponibles
          </span>
        </div>
      </div>

      {showConfirm ? (
        <div className="bg-error-container/30 rounded-2xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[1.25rem] text-error mt-0.5">
              info
            </span>
            <div className="flex-1">
              <p className="font-label-sm font-semibold text-on-surface mb-1">
                ¿Estás seguro?
              </p>
              <p className="font-body-xs text-on-surface-variant">
                Esta acción eliminará permanentemente tu API key de Gemini,
                todos tus borradores de CV, cartas de presentación y
                configuraciones guardadas.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-low/50 rounded-2xl p-4 mb-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-[1.25rem] text-on-surface-variant mt-0.5">
            info
          </span>
          <p className="font-body-xs text-on-surface-variant">
            Al limpiar se eliminarán las claves API, borradores de CV y
            configuraciones. Los datos exportados no se ven afectados.
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 px-4 py-3 rounded-full font-label-sm font-semibold transition-colors
            bg-surface-container-lowest text-error hover:bg-error-container/30 border border-error/20"
        >
          {showConfirm ? 'Confirmar limpieza' : 'Limpiar datos de localStorage'}
        </button>
        {showConfirm && (
          <button
            type="button"
            onClick={handleCancel}
            className="btn-ghost px-4"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
