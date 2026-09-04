"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo } from "react";
import { useCVForm } from "@/hooks/useCVForm";
import { useBilingualSync } from "@/hooks/useBilingualSync";
import { useEditorState } from "@/hooks/useEditorState";
import { computeATSScore } from "@/lib/cv/atsScoring";
import type { CVData } from "@/types/cv";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PreviewPanel } from "@/components/cv-preview";
import { EditorHeader } from "@/components/editor/EditorHeader";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { EditorWorkspace } from "@/components/editor/EditorWorkspace";
import { EditorPreviewPanel } from "@/components/editor/EditorPreviewPanel";
import { EditorFooter } from "@/components/editor/EditorFooter";
import { LanguageSelector } from "@/components/ui";

const PdfImporter = dynamic(
  () =>
    import("@/components/cv-form/PdfImporter").then((mod) => mod.PdfImporter),
  { ssr: false },
);

const TranslateButton = dynamic(
  () =>
    import("@/components/cv-form/TranslateButton").then(
      (mod) => mod.TranslateButton,
    ),
  { ssr: false },
);

export default function EditorPage() {
  return (
    <ErrorBoundary>
      <EditorPageInner />
    </ErrorBoundary>
  );
}

function EditorPageInner() {
  const form = useCVForm();

  const atsScore = useMemo(() => {
    if (!form.formData) return 0;
    return computeATSScore(form.formData, form.lang).overall;
  }, [form.formData, form.lang]);

  const editorState = useEditorState(form.formData, form.lang);

  const handleTranslationSuccess = useCallback(
    (translatedData: CVData) => {
      form.handleApplyCvData(translatedData);
    },
    [form],
  );

  const handleImport = useCallback(
    (data: CVData) => {
      form.handleApplyCvData(data);
    },
    [form],
  );

  const sync = useBilingualSync({
    cvData: form.formData,
    currentLang: form.lang,
    onSuccess: handleTranslationSuccess,
  });

  if (!form.mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary animate-pulse font-headline-xl text-lg">
          Editor de CV
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header contextual */}
      <EditorHeader
        cvData={form.formData}
        lang={form.lang}
        atsScore={atsScore}
        showPreview={form.showPreview}
        onTogglePreview={() => form.setShowPreview(!form.showPreview)}
        onImport={handleImport}
        dict={form.dict}
      />

      {/* Main layout: Sidebar + Workspace + Preview Panel */}
      <div className="max-w-[1400px] mx-auto flex min-h-[calc(100vh-80px-56px)] pt-6 pb-48">
        {/* Sidebar con navegación de secciones */}
        <EditorSidebar
          activeSection={editorState.activeSection}
          sectionStatuses={editorState.sectionStatuses}
          onSectionChange={editorState.setActiveSection}
          atsScore={atsScore}
        />

        {/* Workspace de edición */}

        <div className="w-full ">
          {/* Language Selector */}
          <LanguageSelector
            lang={form.lang}
            onChange={form.handleLangChange}
            onTranslate={handleTranslationSuccess}
            getCvData={() => form.methods.getValues()}
            dict={form.dict}
          />
          <EditorWorkspace
            activeSection={editorState.activeSection}
            onSectionChange={editorState.setActiveSection}
            methods={form.methods}
            dict={form.dict}
            lang={form.lang}
            cvData={form.formData}
          />
        </div>

        {/* Desktop: Split-view preview panel */}
        <EditorPreviewPanel
          isOpen={form.showPreview}
          onClose={() => form.setShowPreview(false)}
          data={form.formData}
          dict={form.dict}
        />
      </div>

      {/* Mobile: Overlay preview (fullscreen, original behavior) */}
      <div className="lg:hidden">
        <PreviewPanel
          isOpen={form.showPreview}
          onClose={() => form.setShowPreview(false)}
          data={form.formData}
          dict={form.dict}
        />
      </div>

      {/* Footer simplificado */}
      <EditorFooter
        isSaving={form.isSaving}
        lastSaved={form.lastSaved}
        onDownloadPdf={form.handleDownloadPDF}
      />
    </div>
  );
}
