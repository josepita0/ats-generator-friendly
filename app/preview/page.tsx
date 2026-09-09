"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { useCVForm } from "@/hooks/useCVForm";
import { CVPreview } from "@/components/cv-preview/CVPreview";
import { ATSDiagnosticPanel } from "@/components/preview/ATSDiagnosticPanel";
import { PreviewControls } from "@/components/preview/PreviewControls";
import { computeATSScore } from "@/lib/cv/atsScoring";
import { generateCvPdf } from "@/lib/pdf/generate";
import type {
  PaperSize,
  MarginPreset,
  FontScale,
} from "@/components/preview/LayoutParameters";

/* ── Main Page ──────────────────────────────── */

export default function PreviewPage() {
  const form = useCVForm();

  // Layout state
  const [paperSize, setPaperSize] = useState<PaperSize>("A4");
  const [marginPreset, setMarginPreset] = useState<MarginPreset>("STANDARD");
  const [fontScale, setFontScale] = useState<FontScale>("10");
  const [zoom, setZoom] = useState(100);
  const [lang, setLang] = useState<"es" | "en">(form.lang || "es");
  const [textCopied, setTextCopied] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  // Sync lang with form
  const handleLangChange = useCallback(
    (l: "es" | "en") => {
      setLang(l);
      form.handleLangChange(l);
    },
    [form],
  );

  // ATS diagnostics — uses shared scoring from lib/cv/atsScoring
  const diagnostics = useMemo(() => {
    if (!form.formData) return null;
    return computeATSScore(form.formData, form.lang);
  }, [form.formData, form.lang]);

  // Map shared ATSScoreResult → ATSDiagnosticPanel props
  const panelProps = useMemo(() => {
    if (!diagnostics) {
      return {
        overallScore: 0,
        progressMetrics: [] as { label: string; percentage: number }[],
        indexabilityRules: [] as {
          id: string;
          label: string;
          description: string;
          passed: boolean;
        }[],
        suggestedKeywords: [] as string[],
      };
    }

    const { breakdown } = diagnostics;
    const progressMetrics = [
      {
        label: "Estructura & Completitud",
        percentage: breakdown.structure.score,
      },
      { label: "Calidad de Contenido", percentage: breakdown.content.score },
      { label: "Keywords Técnicas", percentage: breakdown.keywords.score },
      { label: "Formato & Contacto", percentage: breakdown.formatting.score },
    ];

    // Extract missing keywords from suggestions for display
    const kwSuggestion = diagnostics.suggestions.find(
      (s) => s.includes("keywords como") || s.includes("keywords like"),
    );
    const suggestedKeywords = kwSuggestion
      ? kwSuggestion
          .split(/: /)
          .pop()!
          .split(/, /)
          .map((k: string) => k.replace(/\.$/, "").trim())
      : [];

    const indexabilityRules = [
      {
        id: "column",
        label: "Columna única estricta",
        description: "El PDF usa layout single-column",
        passed: true,
      },
      {
        id: "typo",
        label: "Tipografía Nativa UTF-8",
        description: "Fuentes estándar para extracción de texto",
        passed: true,
      },
      {
        id: "dates",
        label: "Fechas en formato consistente",
        description: "Formato MM/YYYY o YYYY-MM en todas las entradas",
        passed: !diagnostics.suggestions.some(
          (s) => s.includes("formato de fecha") || s.includes("date format"),
        ),
      },
      {
        id: "meta",
        label: "Sin gráficos opacos",
        description: "Sin imágenes, iconos ni elementos decorativos",
        passed: true,
      },
    ];

    return {
      overallScore: diagnostics.overall,
      progressMetrics,
      indexabilityRules,
      suggestedKeywords,
    };
  }, [diagnostics]);

  // Copy text to clipboard
  const handleCopyText = useCallback(async () => {
    if (!previewRef.current) return;
    const text = previewRef.current.innerText;
    try {
      await navigator.clipboard.writeText(text);
      setTextCopied(true);
      setTimeout(() => setTextCopied(false), 2000);
    } catch {
      // Fallback: select text
    }
  }, []);

  // Download PDF
  const handleDownloadPDF = useCallback(async () => {
    if (!form.formData) return;
    await generateCvPdf(form.formData, form.dict);
  }, [form.formData, form.dict]);

  // Export JSON
  const handleExportJSON = useCallback(() => {
    if (!form.formData) return;
    const blob = new Blob([JSON.stringify(form.formData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.formData.personalInfo.name.replace(/\s+/g, "_")}_CV.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [form.formData]);

  // Apply keywords (placeholder — shows feedback)
  const handleApplyKeywords = useCallback(() => {
    // Keywords are suggestions — in a real flow this would update skills
  }, []);

  // Loading state
  if (!form.mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-primary animate-pulse font-headline-xl text-lg">
          Cargando vista previa...
        </div>
      </div>
    );
  }

  const cvData = form.formData;
  const dict = form.dict;

  return (
    <div className="min-h-screen">
      {/* ── Hero ──────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pt-6 pb-2">
        <div className="card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-xl text-[1.75rem] lg:text-[2rem] font-semibold text-on-surface">
              Vista Previa ATS
            </h1>
            <p className="text-on-surface-variant font-body-sm text-[0.8125rem] mt-1">
              Diagnóstico de compatibilidad y exportación PDF
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <button
              type="button"
              onClick={() => handleLangChange("es")}
              className={`chip cursor-pointer transition-colors ${lang === "es" ? "chip-active" : "chip-inactive"}`}
            >
              Español
            </button>
            <button
              type="button"
              onClick={() => handleLangChange("en")}
              className={`chip cursor-pointer transition-colors ${lang === "en" ? "chip-active" : "chip-inactive"}`}
            >
              English
            </button>
            {/* Validation badge */}
            <span className="badge badge-success ml-1">
              <span className="material-symbols-outlined text-[0.5rem]">
                check
              </span>
              {panelProps.overallScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* ── Main content: Diagnostic + Preview ─── */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left panel — Diagnostic */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="lg:sticky lg:top-20">
              <ATSDiagnosticPanel
                overallScore={panelProps.overallScore}
                progressMetrics={panelProps.progressMetrics}
                indexabilityRules={panelProps.indexabilityRules}
                suggestedKeywords={panelProps.suggestedKeywords}
                onApplyKeywords={handleApplyKeywords}
                onExportJSON={handleExportJSON}
                paperSize={paperSize}
                onPaperSizeChange={setPaperSize}
                marginPreset={marginPreset}
                onMarginPresetChange={setMarginPreset}
                fontScale={fontScale}
                onFontScaleChange={setFontScale}
              />
            </div>
          </div>

          {/* Right panel — Preview */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            {/* Controls bar */}
            <div className="card mb-4">
              <PreviewControls
                onCopyText={handleCopyText}
                onDownloadPDF={handleDownloadPDF}
                zoom={zoom}
                onZoomChange={setZoom}
                paperSize={paperSize}
                textCopied={textCopied}
              />
            </div>

            {/* CV Preview — A4 simulation */}
            {cvData ? (
              <div className="flex justify-center">
                <div
                  className="shadow-card rounded-2xl overflow-hidden border border-outline-variant/30 transition-transform duration-200 origin-top"
                  style={{
                    transform: `scale(${zoom / 100})`,
                    width: paperSize === "A4" ? "210mm" : "215.9mm",
                    maxWidth: "100%",
                  }}
                >
                  <div ref={previewRef}>
                    <CVPreview data={cvData} dict={dict} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="card flex flex-col items-center justify-center py-20 text-center">
                <span className="material-symbols-outlined text-outline-variant text-[48px] mb-3">
                  description
                </span>
                <p className="text-on-surface-variant font-body-md">
                  Sin datos de CV
                </p>
                <p className="text-on-surface-variant/60 font-body-sm text-[0.8125rem] mt-1 mb-4">
                  Completá el editor para ver la vista previa
                </p>
                <Link
                  href="/editor"
                  className="btn-primary flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    edit
                  </span>
                  Ir al Editor
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile download bar ──────────────── */}
      {cvData && (
        <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 bg-surface-container-lowest/95 backdrop-blur-sm border-t border-outline-variant/30 px-4 py-3">
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="btn-primary flex items-center gap-2 w-full justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            Descargar PDF (ATS-Compliant)
          </button>
        </div>
      )}
    </div>
  );
}
