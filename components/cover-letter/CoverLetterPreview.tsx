'use client';

import type { PersonalInfo } from '@/types/cv';
import { formatCoverLetterDate } from '@/lib/i18n/dates';

interface Props {
  personalInfo: PersonalInfo;
  body: string;
  language: 'es' | 'en';
}

export function CoverLetterPreview({ personalInfo, body, language }: Props) {
  const dateFormatted = formatCoverLetterDate(language);

  return (
    <div className="bg-white text-gray-900 p-8 font-sans text-sm shadow-md border border-gray-200 rounded-sm h-full overflow-y-auto">
      <header className="text-center mb-6">
        <h2 className="text-lg font-bold">{personalInfo.name}</h2>
        <div className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </header>

      <p className="text-xs text-gray-500 mb-4">{dateFormatted}</p>

      <div className="whitespace-pre-line text-sm leading-relaxed">
        {body}
      </div>
    </div>
  );
}
