'use client';

import { useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { CVData } from '@/types/cv';
import { Dictionary } from '@/lib/i18n/dictionaries';
import { CVPreview } from '@/components/cv-preview';
import { CVDocument } from '@/components/pdf';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: CVData | null;
  dict: Dictionary;
}

export function PreviewPanel({ isOpen, onClose, data, dict }: Props) {
  const handleDownloadPDF = useCallback(async () => {
    if (!data) return;
    const blob = await pdf(<CVDocument data={data} dict={dict} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.personalInfo.name.replace(/\s+/g, '_')}_CV.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [data, dict]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-[90] transition-opacity duration-300 backdrop-blur-sm ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`slide-panel fixed top-0 right-0 w-full md:w-1/2 lg:w-1/3 h-full bg-surface z-[100] retro-border border-r-0 border-t-0 border-b-0 shadow-[-10px_0px_20px_rgba(0,0,0,0.5)] flex flex-col ${
          isOpen ? 'open' : ''
        }`}
      >
        <div className="p-4 bg-surface-container border-b-2 border-black flex justify-between items-center">
          <h2 className="text-on-surface font-headline-md text-xl font-bold">ATS PREVIEW</h2>
          <button onClick={onClose} className="text-on-surface hover:text-primary transition-colors cursor-pointer">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 bg-surface-dim p-4 overflow-y-auto flex justify-center items-start">
          {data ? (
            <CVPreview data={data} dict={dict} />
          ) : (
            <p className="text-on-surface-variant mt-10">No data yet</p>
          )}
        </div>
        <div className="p-6 bg-surface-container border-t-2 border-black flex justify-end gap-4">
          <button
            onClick={handleDownloadPDF}
            disabled={!data}
            className="px-6 py-2 bg-transparent text-on-surface border-2 border-outline rounded-full font-label-md font-bold hover:bg-surface-variant transition-colors disabled:opacity-50"
          >
            {dict.form.downloadPdf}
          </button>
        </div>
      </div>
    </>
  );
}
