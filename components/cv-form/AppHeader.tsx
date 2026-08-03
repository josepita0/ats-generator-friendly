'use client';

interface Props {
  importSlot: React.ReactNode;
  translateSlot: React.ReactNode;
  mobile?: boolean;
}

export function AppHeader({ importSlot, translateSlot, mobile = false }: Props) {
  if (mobile) {
    return (
      <div className="pixel-header flex items-center justify-between px-4 h-[60px]">
        <h1
          className="font-headline-md text-[#FFC329] uppercase tracking-wider select-none leading-tight"
          style={{ fontSize: '0.5rem', textShadow: '2px 2px 0 #06132E' }}
        >
          RETRO CV BUILDER
        </h1>
        <div className="flex items-center gap-2">
          {importSlot}
          {translateSlot}
        </div>
      </div>
    );
  }

  return (
    <div className="pixel-header flex items-center justify-between px-6 h-[70px]">
      <div className="flex items-center gap-3">
        <svg className="w-8 h-8 text-[#FFC329]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="12" height="12" fill="currentColor" />
          <rect x="18" y="4" width="12" height="12" fill="currentColor" />
          <rect x="32" y="4" width="12" height="12" fill="currentColor" />
          <rect x="4" y="18" width="12" height="12" fill="currentColor" />
          <rect x="18" y="18" width="12" height="12" fill="#F86B2A" />
          <rect x="32" y="18" width="12" height="12" fill="currentColor" />
          <rect x="4" y="32" width="12" height="12" fill="currentColor" />
          <rect x="18" y="32" width="12" height="12" fill="currentColor" />
          <rect x="32" y="32" width="12" height="12" fill="currentColor" />
        </svg>
        <h1
          className="font-headline-md text-[#FFC329] uppercase tracking-wider select-none leading-none"
          style={{ fontSize: '0.7rem', textShadow: '2px 2px 0 #06132E' }}
        >
          RETRO CV BUILDER
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {importSlot}
        {translateSlot}
      </div>
    </div>
  );
}
