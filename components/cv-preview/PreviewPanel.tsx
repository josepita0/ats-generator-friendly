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
        className={`fixed inset-0 bg-[#06132E]/80 z-[90] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`slide-panel fixed top-0 right-0 w-full md:w-1/2 lg:w-1/3 h-full bg-[#0E4A57] z-[100] flex flex-col border-l-4 border-[#F86B2A] border-t-4 border-t-[#F86B2A] border-b-4 border-b-[#F86B2A] shadow-[-8px_0px_0px_#06132E] ${
          isOpen ? 'open' : ''
        }`}
      >
        <div className="px-4 py-3 bg-[#3B2E67] border-b-4 border-[#F86B2A] flex justify-between items-center">
          <h2
            className="text-[#FFC329] font-headline-md uppercase"
            style={{ fontSize: '0.6rem', textShadow: '1px 1px 0 #06132E' }}
          >
            ATS PREVIEW
          </h2>
          <button onClick={onClose} className="text-[#FFF3D5] hover:text-[#FFC329] transition-colors cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 bg-[#071539] p-4 overflow-y-auto flex justify-center items-start">
          {data ? (
            <CVPreview data={data} dict={dict} />
          ) : (
            <p className="text-[#FFF3D5]/60 mt-10">No data yet</p>
          )}
        </div>
        <div className="p-5 bg-[#0E4A57] border-t-4 border-[#F86B2A] flex justify-end gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={!data}
            className="px-btn-orange py-2 px-6 text-sm"
          >
            {dict.form.downloadPdf}
          </button>
        </div>
      </div>
    </>
  );
}
