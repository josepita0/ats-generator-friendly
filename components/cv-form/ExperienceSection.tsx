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
    <div className="bg-surface-container-lowest rounded-3xl shadow-card">
      <div className="flex items-center justify-between px-spacing-lg py-4 border-b border-outline-variant/30">
        <div className="flex items-center gap-2 font-title-sm text-title-sm text-on-surface">
          <span className="material-symbols-outlined text-[18px]">
            work
          </span>
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
            className="btn-secondary flex items-center gap-1.5 text-[0.8125rem]"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            {dict.form.add}
          </button>
          <button
            type="button"
            onClick={() => setCollapsed(!effectiveCollapsed)}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors"
          >
            <span
              className={`material-symbols-outlined text-[20px] transition-transform ${
                !effectiveCollapsed ? "" : "rotate-180"
              }`}
            >
              expand_more
            </span>
          </button>
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          !effectiveCollapsed ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-spacing-lg space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-surface-container-low rounded-2xl border border-outline-variant/30 p-4 relative"
            >
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors cursor-pointer"
                aria-label={dict.form.remove}
              >
                <span className="material-symbols-outlined text-[14px]">
                  close
                </span>
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-5">
                  <label className="font-label-xs text-label-xs text-on-surface-variant uppercase mb-1.5 block">
                    {dict.fields.company}
                  </label>
                  <input
                    {...register(`experience.${index}.company` as const, {
                      required: dict.validation.required,
                    })}
                    className="input-field"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="font-label-xs text-label-xs text-on-surface-variant uppercase mb-1.5 block">
                    {dict.fields.location}
                  </label>
                  <input
                    {...register(`experience.${index}.location` as const)}
                    className="input-field"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="font-label-xs text-label-xs text-on-surface-variant uppercase mb-1.5 block">
                    {dict.fields.startDate}
                  </label>
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
                        dict={dict}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="font-label-xs text-label-xs text-on-surface-variant uppercase mb-1.5 block">
                    {dict.fields.position} (ES)
                  </label>
                  <input
                    {...register(`experience.${index}.position.es` as const, {
                      required: dict.validation.required,
                    })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="font-label-xs text-label-xs text-on-surface-variant uppercase mb-1.5 block">
                    {dict.fields.position} (EN)
                  </label>
                  <input
                    {...register(`experience.${index}.position.en` as const)}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="font-label-xs text-label-xs text-on-surface-variant uppercase mb-1.5 block">
                    {dict.fields.descriptions} (ES)
                  </label>
                  <textarea
                    {...register(
                      `experience.${index}.descriptions.es` as const,
                      { required: dict.validation.required },
                    )}
                    rows={4}
                    className="input-field resize-none text-xs"
                  />
                </div>
                <div>
                  <label className="font-label-xs text-label-xs text-on-surface-variant uppercase mb-1.5 block">
                    {dict.fields.descriptions} (EN)
                  </label>
                  <textarea
                    {...register(
                      `experience.${index}.descriptions.en` as const,
                    )}
                    rows={4}
                    className="input-field resize-none text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
