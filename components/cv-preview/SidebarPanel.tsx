'use client';

interface Props {
  onPreviewClick: () => void;
  lang: 'es' | 'en';
  onLangChange: (lang: 'es' | 'en') => void;
  chatSlot: React.ReactNode;
  coverSlot: React.ReactNode;
}

function LivePreviewThumbnail({ onClick }: { onClick: () => void }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-4 h-4 text-[#FFF3D5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.586-5.586A1 1 0 0012.914 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span
          className="text-[#FFF3D5] uppercase tracking-wider font-headline-md"
          style={{ fontSize: '0.5rem' }}
        >
          LIVE PREVIEW
        </span>
      </div>

      <button type="button" onClick={onClick} className="px-preview-thumb w-full text-left">
        <div className="flex min-h-[120px] bg-[#FFF3D5] rounded overflow-hidden relative">
          <div className="w-3 bg-[#0E4A57] shrink-0" />

          <div className="flex-1 p-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-[#FFC329] border border-[#06132E]" />
              <div>
                <div className="h-1.5 bg-[#06132E] rounded w-14 mb-0.5" />
                <div className="h-1 bg-[#3B2E67] rounded w-10" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="h-0.5 bg-[#0E4A57]/40 rounded w-full" />
              <div className="h-1 bg-[#06132E]/60 rounded w-3/4" />
              <div className="h-1 bg-[#06132E]/60 rounded w-2/3" />
              <div className="h-1 bg-[#06132E]/60 rounded w-5/6" />
              <div className="h-1 bg-[#06132E]/60 rounded w-1/2" />
              <div className="h-0.5 bg-[#0E4A57]/40 rounded w-full" />
              <div className="h-1 bg-[#06132E]/60 rounded w-3/4" />
              <div className="h-1 bg-[#06132E]/60 rounded w-2/3" />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

export function SidebarPanel({
  onPreviewClick,
  lang,
  onLangChange,
  chatSlot,
  coverSlot,
}: Props) {
  return (
    <div className="pixel-sidebar bg-[#0E4A57] flex flex-col gap-4 rounded-[10px] sticky top-6 p-5 max-h-[calc(100vh-40px)] overflow-y-auto px-scroll">
      <div className="flex items-center justify-between">
        <span
          className="text-[#FFF3D5] uppercase tracking-wider font-headline-md"
          style={{ fontSize: '0.5rem' }}
        >
          AI ASSISTANT & PREVIEW
        </span>
        <select
          value={lang}
          onChange={(e) => onLangChange(e.target.value as 'es' | 'en')}
          className="px-input w-auto text-xs py-1 px-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
        >
          <option value="es">ES</option>
          <option value="en">EN</option>
        </select>
      </div>

      <div className="flex items-start gap-3">
        <div className="px-badge-robot shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-[#06132E]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 110 2h-1v1a7 7 0 01-7 7H9a7 7 0 01-7-7v-1H1a1 1 0 110-2h1v-1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM8 11a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z" />
          </svg>
        </div>
        <div className="px-speech-bubble flex-1">
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem' }}>
            Let&apos;s optimize your resume for ATS!
          </p>
        </div>
      </div>

      <div className="text-[#FFF3D5] text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
        {lang === 'es'
          ? 'Pega una oferta de trabajo y pídeme que adapte tu CV.'
          : 'Paste a job description and ask me to adapt your CV.'}
      </div>

      {chatSlot}

      <div className="border-t border-[#2AB7C9]/30 pt-4">
        {coverSlot}
      </div>

      <div className="border-t border-[#2AB7C9]/30 pt-4">
        <LivePreviewThumbnail onClick={onPreviewClick} />
      </div>

      <button
        type="button"
        onClick={onPreviewClick}
        className="px-btn-yellow w-full flex flex-col items-center justify-center h-[64px]"
      >
        <span>GENERATE &</span>
        <span>DOWNLOAD PDF</span>
      </button>
    </div>
  );
}
