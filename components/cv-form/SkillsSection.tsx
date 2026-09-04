"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { CVData } from "@/types/cv";
import { Dictionary } from "@/lib/i18n/dictionaries";

interface Props {
  dict: Dictionary;
  forceCollapsed?: boolean | null;
}

export function SkillsSection({ dict, forceCollapsed }: Props) {
  const { register } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({ name: "skills" });
  const [collapsed, setCollapsed] = useState(false);
  const effectiveCollapsed = forceCollapsed ?? collapsed;

  return (
    <div className="bg-surface-container-lowest rounded-3xl shadow-card">
      <div className="flex items-center justify-between px-spacing-lg py-4 border-b border-outline-variant/30">
        <div className="flex items-center gap-2 font-title-sm text-title-sm text-on-surface">
          <span className="material-symbols-outlined text-[18px]">
            code_blocks
          </span>
          {dict.form.skills}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              append({
                id: crypto.randomUUID(),
                category: "",
                skills: [],
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
                    {dict.fields.category}
                  </label>
                  <input
                    {...register(`skills.${index}.category` as const, {
                      required: dict.validation.required,
                    })}
                    className="input-field"
                    placeholder="Programming Languages, Frameworks, Tools"
                  />
                </div>
                <div className="sm:col-span-7">
                  <label className="font-label-xs text-label-xs text-on-surface-variant uppercase mb-1.5 block">
                    {dict.fields.skillList}
                  </label>
                  <input
                    {...register(`skills.${index}.skills` as const, {
                      required: dict.validation.required,
                    })}
                    className="input-field"
                    placeholder="React, TypeScript, Node.js"
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
