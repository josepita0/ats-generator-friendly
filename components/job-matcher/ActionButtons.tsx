'use client';

interface Props {
  onAdaptWithAI?: () => void;
  onImportCV?: () => void;
  disabled?: boolean;
  isAnalyzing?: boolean;
}

export function ActionButtons({ onAdaptWithAI, onImportCV, disabled = false, isAnalyzing = false }: Props) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onAdaptWithAI}
        disabled={disabled}
        className={`btn-primary flex items-center justify-center gap-2 w-full disabled:cursor-not-allowed ${isAnalyzing ? 'ring-2 ring-primary/30' : ''}`}
      >
        <span className={`material-symbols-outlined text-[18px] ${isAnalyzing ? 'animate-pulse' : ''}`}>
          {isAnalyzing ? 'hourglass_empty' : 'auto_awesome'}
        </span>
        {isAnalyzing ? 'Analizando compatibilidad...' : 'Adaptar y sugerir cambios con Gemini'}
      </button>
      <button
        type="button"
        onClick={onImportCV}
        disabled={isAnalyzing}
        className="btn-secondary flex items-center justify-center gap-2 w-full"
      >
        <span className="material-symbols-outlined text-[18px]">upload_file</span>
        Importar CV existente desde PDF
      </button>
    </div>
  );
}
