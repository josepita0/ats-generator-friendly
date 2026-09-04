"use client";

import { useCallback } from "react";
import type { PaperSize } from "@/components/preview/LayoutParameters";

interface Props {
  onCopyText: () => void;
  onPrint: () => void;
  onDownloadPDF: () => void;
  zoom: number;
  onZoomChange: (z: number) => void;
  paperSize: PaperSize;
  textCopied: boolean;
}

export function PreviewControls({
  onCopyText,
  onPrint,
  onDownloadPDF,
  zoom,
  onZoomChange,
  paperSize,
  textCopied,
}: Props) {
  const handleZoomIn = useCallback(() => {
    onZoomChange(Math.min(zoom + 10, 150));
  }, [zoom, onZoomChange]);

  const handleZoomOut = useCallback(() => {
    onZoomChange(Math.max(zoom - 10, 60));
  }, [zoom, onZoomChange]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Copy text */}
      <button
        type="button"
        onClick={onCopyText}
        className="btn-ghost flex items-center gap-1.5 text-[0.8125rem]"
      >
        <span className="material-symbols-outlined text-[16px]">
          {textCopied ? "check" : "content_copy"}
        </span>
        <span className="hidden sm:inline">
          {textCopied ? "Copiado" : "Copiar Texto"}
        </span>
      </button>

      {/* Download PDF */}
      <button
        type="button"
        onClick={onDownloadPDF}
        className="btn-primary flex items-center gap-1.5 text-[0.8125rem]"
      >
        <span className="material-symbols-outlined text-[16px]">download</span>
        <span className="hidden sm:inline">Descargar PDF ATS</span>
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Zoom controls */}
      <div className="flex items-center gap-1 bg-surface-container rounded-full px-1 py-0.5">
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors"
          aria-label="Zoom out"
        >
          <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
            remove
          </span>
        </button>
        <span className="text-[0.6875rem] font-semibold text-on-surface w-8 text-center font-label-xs">
          {zoom}%
        </span>
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors"
          aria-label="Zoom in"
        >
          <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
            add
          </span>
        </button>
      </div>

      {/* Badges */}
      <span className="badge badge-success">
        {paperSize === "A4" ? "A4 (210 × 297 mm)" : 'Letter (8.5 × 11")'}
      </span>
      <span className="badge badge-success">
        <span className="material-symbols-outlined text-[0.5rem]">check</span>
        UTF-8 Indexable
      </span>
    </div>
  );
}
