"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { CVData } from "@/types/cv";
import { Dictionary } from "@/lib/i18n/dictionaries";

interface Props {
  dict: Dictionary;
}

export function SkillsSection({ dict }: Props) {
  const { register } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({ name: "skills" });
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="section-card">
      <div className="section-header rounded-t-lg">
        <div className="section-header-title">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
          </svg>
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
            className="px-btn-add"
          >
            + {dict.form.add}
          </button>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="text-[#FFF3D5] hover:brightness-110 cursor-pointer"
          >
            <svg
              className={`w-5 h-5 chevron-icon ${!collapsed ? 'rotated' : ''}`}
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
      <div className={`section-collapse ${!collapsed ? 'open' : ''}`}>
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
                <label className="px-label">{dict.fields.category}</label>
                <input
                  {...register(`skills.${index}.category` as const, {
                    required: dict.validation.required,
                  })}
                  className="px-input"
                  placeholder="Programming Languages, Frameworks, Tools"
                />
              </div>
              <div className="mt-3">
                <label className="px-label">{dict.fields.skillList}</label>
                <input
                  {...register(`skills.${index}.skills` as const, {
                    required: dict.validation.required,
                  })}
                  className="px-input"
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
