'use client';

import { CVData } from '@/types/cv';
import { Dictionary } from '@/lib/i18n/dictionaries';
import { parseBullets } from '@/lib/cv/descriptions';

interface Props {
  data: CVData;
  dict: Dictionary;
}

export function CVPreview({ data, dict }: Props) {
  const { personalInfo, summary, experience, education, skills, languages, language } = data;

  const MONTHS_ES = ['', 'Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'];
  const MONTHS_EN = ['', 'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    const parts = date.split(/[\/-]/);
    if (parts.length !== 2) return date;
    let month = parts[0];
    let year = parts[1];
    if (parts[0].length === 4) {
      year = parts[0];
      month = parts[1];
    }
    const months = language === 'en' ? MONTHS_EN : MONTHS_ES;
    const monthName = months[parseInt(month, 10)] || month;
    return `${monthName} ${year}`;
  };

  const content = language === 'es' ? summary.es : summary.en;

  return (
    <div className="bg-white p-8 font-sans text-sm text-gray-900">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold">{personalInfo.name}</h1>
        <div className="mt-2 flex flex-wrap justify-center gap-2 text-xs">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </header>

      {content && (
        <section className="mb-6">
          <h2 className="mb-2 border-b border-gray-300 text-lg font-semibold uppercase">
            {dict.form.summary}
          </h2>
          <p className="whitespace-pre-line">{content}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 border-b border-gray-300 text-lg font-semibold uppercase">
            {dict.form.experience}
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-semibold">
                  {language === 'es' ? exp.position.es : exp.position.en}
                </h3>
                <span className="text-xs">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>{exp.company}</span>
                <span>{exp.location}</span>
              </div>
              {(() => {
                const desc = language === 'es' ? exp.descriptions.es : exp.descriptions.en;
                if (!desc) return null;
                const result = parseBullets(desc);
                if (result) {
                  return (
                    <ul className="mt-1 list-none text-xs whitespace-pre-line">
                      {result.items.map((item, i) => (
                        <li key={i}>{result.bullet} {item}</li>
                      ))}
                    </ul>
                  );
                }
                return <p className="mt-1 whitespace-pre-line text-xs">{desc}</p>;
              })()}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 border-b border-gray-300 text-lg font-semibold uppercase">
            {dict.form.education}
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between">
                <h3 className="font-semibold">{edu.institution}</h3>
                <span className="text-xs">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
              <p className="text-xs">
                {language === 'es' ? edu.degree.es : edu.degree.en} — {language === 'es' ? edu.field.es : edu.field.en}
              </p>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 border-b border-gray-300 text-lg font-semibold uppercase">
            {dict.form.skills}
          </h2>
          {skills.map((cat) => (
            <div key={cat.id} className="mb-2">
              <h3 className="text-xs font-semibold">{cat.category}:</h3>
              <p className="text-xs">{cat.skills.join(', ')}</p>
            </div>
          ))}
        </section>
      )}

      {languages.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 border-b border-gray-300 text-lg font-semibold uppercase">
            {dict.form.languages}
          </h2>
          <div className="flex flex-wrap gap-4">
            {languages.map((lang) => (
              <span key={lang.id} className="text-xs">
                {lang.language} — {lang.level}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
