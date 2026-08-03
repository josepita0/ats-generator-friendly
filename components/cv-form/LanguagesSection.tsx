"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { CVData } from "@/types/cv";
import { Dictionary } from "@/lib/i18n/dictionaries";

interface Props {
  dict: Dictionary;
  forceCollapsed?: boolean | null;
}

export function LanguagesSection({ dict, forceCollapsed }: Props) {
  const { register } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({ name: "languages" });
  const [collapsed, setCollapsed] = useState(false);
  const effectiveCollapsed = forceCollapsed ?? collapsed;

  return (
    <div className="section-card">
      <div className="section-header rounded-t-lg">
        <div className="section-header-title">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.91-4.33-3.56zm2.95-8H5.08c.96-1.65 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
          </svg>
          {dict.form.languages}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              append({
                id: crypto.randomUUID(),
                language: "",
                level: "",
              })
            }
            className="px-btn-add"
          >
            + {dict.form.add}
          </button>
          <button
            type="button"
            onClick={() => setCollapsed(!effectiveCollapsed)}
            className="text-[#FFF3D5] hover:brightness-110 cursor-pointer"
          >
            <svg
              className={`w-5 h-5 chevron-icon ${!effectiveCollapsed ? 'rotated' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className={`section-collapse ${!effectiveCollapsed ? 'open' : ''}`}>
        <div>
          <div className="section-body space-y-4 rounded-b-lg">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-[#FFF3D5]/40 border-2 border-[#06132E] rounded-lg p-4 relative"
            >
              <button
                type="button"
                onClick={() => remove(index)}
                className="px-remove-btn"
              >
                ✕
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="px-label">{dict.fields.language}</label>
                  <input
                    {...register(`languages.${index}.language` as const, {
                      required: dict.validation.required,
                    })}
                    className="px-input"
                  />
                </div>
                <div>
                  <label className="px-label">{dict.fields.level}</label>
                  <input
                    {...register(`languages.${index}.level` as const, {
                      required: dict.validation.required,
                    })}
                    className="px-input"
                    placeholder="Native, Fluent, Advanced"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
