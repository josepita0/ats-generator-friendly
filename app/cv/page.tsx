"use client";

import { useCVForm } from "@/hooks/useCVForm";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PreviewPanel } from "@/components/cv-preview";
import {
  DesktopLayout,
  MobileLayout,
  MobileChatPanel,
} from "@/components/cv-page";

export default function CVPage() {
  return (
    <ErrorBoundary>
      <CVPageInner />
    </ErrorBoundary>
  );
}

function CVPageInner() {
  const form = useCVForm();

  if (!form.mounted) {
    return (
      <div className="bg-pattern min-h-screen flex items-center justify-center">
        <div
          className="text-[#FFC329] font-headline-md animate-pulse"
          style={{ fontSize: "0.7rem", textShadow: "2px 2px 0 #06132E" }}
        >
          RETRORESUME
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pattern min-h-screen relative overflow-x-hidden">
      {/* Desktop layout */}
      <div className="hidden lg:block">
        <DesktopLayout
          dict={form.dict}
          methods={form.methods}
          handleSubmit={form.handleSubmit}
          onSubmit={form.onSubmit}
          collapseAll={form.collapseAll}
          setCollapseAll={form.setCollapseAll}
          handlePreview={form.handlePreview}
          handleApplyCvData={form.handleApplyCvData}
          handleApplyChatSuggestion={form.handleApplyChatSuggestion}
          getValues={form.getValues}
          setValue={form.setValue}
          lang={form.lang}
          jobDescription={form.jobDescription}
          setJobDescription={form.setJobDescription}
        />
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden">
        <MobileLayout
          dict={form.dict}
          methods={form.methods}
          handleSubmit={form.handleSubmit}
          onSubmit={form.onSubmit}
          collapseAll={form.collapseAll}
          setCollapseAll={form.setCollapseAll}
          handleApplyCvData={form.handleApplyCvData}
          handleDownloadPDF={form.handleDownloadPDF}
          getValues={form.getValues}
          lang={form.lang}
          jobDescription={form.jobDescription}
          activeTab={form.activeTab}
          setActiveTab={form.setActiveTab}
          generateSubTab={form.generateSubTab}
          setGenerateSubTab={form.setGenerateSubTab}
          coverLetterVersion={form.coverLetterVersion}
          setCoverLetterVersion={form.setCoverLetterVersion}
        />
      </div>

      {/* Mobile chat panel */}
      <MobileChatPanel
        dict={form.dict}
        showChatPanel={form.showChatPanel}
        setShowChatPanel={form.setShowChatPanel}
        getValues={form.getValues}
        handleApplyChatSuggestion={form.handleApplyChatSuggestion}
        lang={form.lang}
        jobDescription={form.jobDescription}
        setJobDescription={form.setJobDescription}
      />

      {/* Full-screen preview panel */}
      <PreviewPanel
        isOpen={form.showPreview}
        onClose={() => form.setShowPreview(false)}
        data={form.formData}
        dict={form.dict}
      />
    </div>
  );
}
