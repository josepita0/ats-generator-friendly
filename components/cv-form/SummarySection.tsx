"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CVData } from "@/types/cv";
import { Dictionary } from "@/lib/i18n/dictionaries";

interface Props {
  dict: Dictionary;
}

export function SummarySection({ dict }: Props) {
  const { register } = useFormContext<CVData>();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="section-card">
      <div className="section-header rounded-t-lg">
        <div className="section-header-title">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
          {dict.form.summary}
        </div>
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
      <div className={`section-collapse ${!collapsed ? 'open' : ''}`}>
        <div>
          <div className="section-body space-y-4 rounded-b-lg">
            <div>
              <label className="px-label">{dict.fields.summaryEs}</label>
              <textarea
                {...register("summary.es", {
                  required: dict.validation.required,
                })}
                rows={3}
                className="px-input resize-none"
              />
            </div>
            <div>
              <label className="px-label">{dict.fields.summaryEn}</label>
              <textarea
                {...register("summary.en")}
                rows={3}
                className="px-input resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
