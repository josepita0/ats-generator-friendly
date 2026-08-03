'use client';

import type { PersonalInfo } from '@/types/cv';

const MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface Props {
  personalInfo: PersonalInfo;
  body: string;
  language: 'es' | 'en';
}

export function CoverLetterPreview({ personalInfo, body, language }: Props) {
  const now = new Date();
  const day = now.getDate();
  const year = now.getFullYear();

  const dateFormatted =
    language === 'es'
      ? `${day} de ${MONTHS_ES[now.getMonth()]} de ${year}`
      : `${MONTHS_EN[now.getMonth()]} ${day}, ${year}`;

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
