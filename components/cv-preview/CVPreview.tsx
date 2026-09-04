"use client";

import { CVData } from "@/types/cv";
import { Dictionary } from "@/lib/i18n/dictionaries";
import { parseBullets } from "@/lib/cv/descriptions";
import { formatDate } from "@/lib/i18n/dates";

interface Props {
  data: CVData;
  dict: Dictionary;
}

export function CVPreview({ data, dict }: Props) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    languages,
    language,
  } = data;

  const content = language === "es" ? summary.es : summary.en;

  return (
    <div className="bg-white p-8 sm:p-10 text-[0.8125rem] leading-relaxed text-gray-900">
      <header className="mb-7 text-center">
        <h1 className="text-[1.5rem] font-bold font-serif text-gray-950 tracking-tight">
          {personalInfo.name}
        </h1>
        <div className="mt-2.5 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[0.6875rem] text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </header>

      {content && (
        <section className="mb-7">
          <h2 className="mb-2.5 pb-1.5 border-b border-gray-200 text-[0.8125rem] font-bold uppercase tracking-wider text-gray-800">
            {dict.form.summary}
          </h2>
          <p className="whitespace-pre-line text-[0.8125rem] leading-relaxed text-gray-700">
            {content}
          </p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-7">
          <h2 className="mb-2.5 pb-1.5 border-b border-gray-200 text-[0.8125rem] font-bold uppercase tracking-wider text-gray-800">
            {dict.form.experience}
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-5 last:mb-0">
              <div className="flex justify-between items-baseline gap-4">
                <h3 className="font-semibold text-[0.8125rem] text-gray-900">
                  {language === "es" ? exp.position.es : exp.position.en}
                </h3>
                <span className="text-[0.6875rem] text-gray-500 shrink-0 whitespace-nowrap">
                  {formatDate(exp.startDate, language)} -{" "}
                  {exp.current
                    ? language === "es"
                      ? "Actual"
                      : "Present"
                    : formatDate(exp.endDate, language)}
                </span>
              </div>
              <div className="flex justify-between text-[0.6875rem] text-gray-500 mt-0.5">
                <span>{exp.company}</span>
                <span>{exp.location}</span>
              </div>
              {(() => {
                const desc =
                  language === "es" ? exp.descriptions.es : exp.descriptions.en;
                if (!desc) return null;
                const result = parseBullets(desc);
                if (result) {
                  return (
                    <ul className="mt-2 space-y-0.5 list-none text-[0.75rem] text-gray-700">
                      {result.items.map((item, i) => (
                        <li key={i} className="flex gap-1.5">
                          <span className="text-gray-400 shrink-0">
                            {result.bullet}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p className="mt-2 whitespace-pre-line text-[0.75rem] text-gray-700">
                    {desc}
                  </p>
                );
              })()}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-7">
          <h2 className="mb-2.5 pb-1.5 border-b border-gray-200 text-[0.8125rem] font-bold uppercase tracking-wider text-gray-800">
            {dict.form.education}
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3 last:mb-0">
              <div className="flex justify-between items-baseline gap-4">
                <h3 className="font-semibold text-[0.8125rem] text-gray-900">
                  {edu.institution}
                </h3>
                <span className="text-[0.6875rem] text-gray-500 shrink-0 whitespace-nowrap">
                  {formatDate(edu.startDate, language)} -{" "}
                  {formatDate(edu.endDate, language)}
                </span>
              </div>
              <p className="text-[0.75rem] text-gray-600 mt-0.5">
                {language === "es" ? edu.degree.es : edu.degree.en} —{" "}
                {language === "es" ? edu.field.es : edu.field.en}
              </p>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-7">
          <h2 className="mb-2.5 pb-1.5 border-b border-gray-200 text-[0.8125rem] font-bold uppercase tracking-wider text-gray-800">
            {dict.form.skills}
          </h2>
          {skills.map((cat) => (
            <div key={cat.id} className="mb-2 last:mb-0">
              <h3 className="text-[0.75rem] font-semibold text-gray-800">
                {cat.category}:
              </h3>
              <p className="text-[0.75rem] text-gray-700 mt-0.5">
                {cat.skills.join(", ")}
              </p>
            </div>
          ))}
        </section>
      )}

      {languages.length > 0 && (
        <section>
          <h2 className="mb-2.5 pb-1.5 border-b border-gray-200 text-[0.8125rem] font-bold uppercase tracking-wider text-gray-800">
            {dict.form.languages}
          </h2>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5">
            {languages.map((lang) => (
              <span key={lang.id} className="text-[0.75rem] text-gray-700">
                {lang.language} — {lang.level}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
