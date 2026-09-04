'use client';

interface Props {
  onAdaptWithAI?: () => void;
  onImportCV?: () => void;
  disabled?: boolean;
}

export function ActionButtons({ onAdaptWithAI, onImportCV, disabled = false }: Props) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onAdaptWithAI}
        disabled={disabled}
        className="btn-primary flex items-center justify-center gap-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
        Adaptar y sugerir cambios con Gemini
      </button>
      <button
        type="button"
        onClick={onImportCV}
        className="btn-secondary flex items-center justify-center gap-2 w-full"
      >
        <span className="material-symbols-outlined text-[18px]">upload_file</span>
        Importar CV existente desde PDF
      </button>
    </div>
  );
}
