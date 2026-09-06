"use client";

interface Props {
  onAdaptWithAI?: () => void;
  disabled?: boolean;
  isAnalyzing?: boolean;
  hasApiKey?: boolean;
}

export function ActionButtons({
  onAdaptWithAI,
  disabled = false,
  isAnalyzing = false,
  hasApiKey = true,
}: Props) {
  return (
    <div>
      <button
        type="button"
        onClick={onAdaptWithAI}
        disabled={disabled || !hasApiKey}
        title={
          !hasApiKey
            ? "Configurá tu API Key en Settings para usar el análisis con Gemini"
            : undefined
        }
        className={`btn-primary flex items-center justify-center gap-2 w-full disabled:cursor-not-allowed ${isAnalyzing ? "ring-2 ring-primary/30" : ""}`}
      >
        <span
          className={`material-symbols-outlined text-[18px] ${isAnalyzing ? "animate-pulse" : ""}`}
        >
          {isAnalyzing ? "hourglass_empty" : "auto_awesome"}
        </span>
        {isAnalyzing
          ? "Analizando compatibilidad..."
          : hasApiKey
            ? "Adaptar y sugerir cambios"
            : "Configurá tu API Key en Settings"}
      </button>
    </div>
  );
}
