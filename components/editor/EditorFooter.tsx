"use client";

import { useState, useEffect } from "react";

interface EditorFooterProps {
  isSaving: boolean;
  lastSaved: Date | null;
  onDownloadPdf: () => void;
}

export function EditorFooter({
  isSaving,
  lastSaved,
  onDownloadPdf,
}: EditorFooterProps) {
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    if (!lastSaved) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
      setSecondsAgo(diff);
    }, 30000);

    return () => clearInterval(interval);
  }, [lastSaved]);

  return (
    <div className="fixed bottom-20 left-6 right-6 z-30">
      <div className="max-w-[1400px] mx-auto bg-surface-container-lowest rounded-full shadow-card border border-outline-variant/30 px-6 py-3 flex items-center justify-between">
        {/* Save status */}
        <div className="flex items-center gap-2 text-on-surface-variant min-w-0">
          {isSaving ? (
            <>
              <span className="material-symbols-outlined text-[16px] animate-pulse shrink-0 text-primary">
                hourglass_empty
              </span>
              <span className="font-label-sm text-label-sm whitespace-nowrap">
                Guardando...
              </span>
            </>
          ) : lastSaved ? (
            <>
              <span className="material-symbols-outlined text-success text-[16px] shrink-0">
                check_circle
              </span>
              <span className="font-label-sm text-label-sm whitespace-nowrap">
                {secondsAgo < 60
                  ? "Autoguardado local hace 2s"
                  : secondsAgo < 3600
                    ? `Autoguardado local hace ${Math.floor(secondsAgo / 60)}m`
                    : `Autoguardado local hace ${Math.floor(secondsAgo / 3600)}h`}
              </span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-on-surface-variant/50 text-[16px] shrink-0">
                info
              </span>
              <span className="font-label-sm text-label-sm whitespace-nowrap">
                Sin guardar
              </span>
            </>
          )}
          <span className="hidden sm:inline text-on-surface-variant/40 mx-2">
            •
          </span>
          <span className="hidden sm:inline font-label-sm text-label-sm text-on-surface-variant/70 whitespace-nowrap">
            Zero Server / Datos en tu equipo
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDownloadPdf}
            className="btn-primary flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">
              picture_as_pdf
            </span>
            <span className="hidden sm:inline">Previsualizar PDF ATS</span>
            <span className="sm:hidden">PDF</span>
            <span className="material-symbols-outlined text-[14px]">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
