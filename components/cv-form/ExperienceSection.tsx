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

export function ExperienceSection({ dict, forceCollapsed }: Props) {
  const { register, control } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({ name: "experience" });
  const [collapsed, setCollapsed] = useState(false);
  const effectiveCollapsed = forceCollapsed ?? collapsed;

  return (
    <div className="section-card">
      <div className="section-header rounded-t-lg">
        <div className="section-header-title">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
          </svg>
          {dict.form.experience}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              append({
                id: crypto.randomUUID(),
                company: "",
                position: { es: "", en: "" },
                location: "",
                startDate: "",
                endDate: "",
                current: false,
                descriptions: { es: "", en: "" },
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
                  <label className="px-label">{dict.fields.company}</label>
                  <input
                    {...register(`experience.${index}.company` as const, {
                      required: dict.validation.required,
                    })}
                    className="px-input"
                  />
                </div>
                <div>
                  <label className="px-label">{dict.fields.location}</label>
                  <input
                    {...register(`experience.${index}.location` as const)}
                    className="px-input"
                  />
                </div>
                <div>
                  <label className="px-label">
                    {dict.fields.position} (ES)
                  </label>
                  <input
                    {...register(`experience.${index}.position.es` as const, {
                      required: dict.validation.required,
                    })}
                    className="px-input"
                  />
                </div>
                <div>
                  <label className="px-label">
                    {dict.fields.position} (EN)
                  </label>
                  <input
                    {...register(`experience.${index}.position.en` as const)}
                    className="px-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="px-label">{dict.fields.startDate}</label>
                  <Controller
                    control={control}
                    name={`experience.${index}.startDate` as const}
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
                    name={`experience.${index}.endDate` as const}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="px-label">
                    {dict.fields.descriptions} (ES)
                  </label>
                  <textarea
                    {...register(
                      `experience.${index}.descriptions.es` as const,
                      { required: dict.validation.required },
                    )}
                    rows={4}
                    className="px-input resize-none text-xs"
                  />
                </div>
                <div>
                  <label className="px-label">
                    {dict.fields.descriptions} (EN)
                  </label>
                  <textarea
                    {...register(
                      `experience.${index}.descriptions.en` as const,
                    )}
                    rows={4}
                    className="px-input resize-none text-xs"
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
