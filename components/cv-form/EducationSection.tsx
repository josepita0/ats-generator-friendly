"use client";

import { useState } from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { CVData } from "@/types/cv";
import { Dictionary } from "@/lib/i18n/dictionaries";
import { MonthYearPicker } from "./MonthYearPicker";

interface Props {
  dict: Dictionary;
  forceCollapsed?: boolean | null;
}

export function EducationSection({ dict, forceCollapsed }: Props) {
  const { register, control } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({ name: "education" });
  const [collapsed, setCollapsed] = useState(false);
  const effectiveCollapsed = forceCollapsed ?? collapsed;

  return (
    <div className="section-card">
      <div className="section-header rounded-t-lg">
        <div className="section-header-title">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
          </svg>
          {dict.form.education}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              append({
                id: crypto.randomUUID(),
                institution: "",
                degree: { es: "", en: "" },
                field: { es: "", en: "" },
                startDate: "",
                endDate: "",
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
              <div>
                <label className="px-label">{dict.fields.institution}</label>
                <input
                  {...register(`education.${index}.institution` as const, {
                    required: dict.validation.required,
                  })}
                  className="px-input"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="px-label">{dict.fields.degree} (ES)</label>
                  <input
                    {...register(`education.${index}.degree.es` as const, {
                      required: dict.validation.required,
                    })}
                    className="px-input"
                  />
                </div>
                <div>
                  <label className="px-label">{dict.fields.degree} (EN)</label>
                  <input
                    {...register(`education.${index}.degree.en` as const)}
                    className="px-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="px-label">{dict.fields.field} (ES)</label>
                  <input
                    {...register(`education.${index}.field.es` as const, {
                      required: dict.validation.required,
                    })}
                    className="px-input"
                  />
                </div>
                <div>
                  <label className="px-label">{dict.fields.field} (EN)</label>
                  <input
                    {...register(`education.${index}.field.en` as const)}
                    className="px-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="px-label">{dict.fields.startDate}</label>
                  <Controller
                    control={control}
                    name={`education.${index}.startDate` as const}
                    rules={{ required: dict.validation.required }}
                    render={({ field: f }) => (
                      <MonthYearPicker
                        value={f.value}
                        onChange={f.onChange}
                        onBlur={f.onBlur}
                        name={f.name}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="px-label">{dict.fields.endDate}</label>
                  <Controller
                    control={control}
                    name={`education.${index}.endDate` as const}
                    render={({ field: f }) => (
                      <MonthYearPicker
                        value={f.value}
                        onChange={f.onChange}
                        onBlur={f.onBlur}
                        name={f.name}
                      />
                    )}
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
