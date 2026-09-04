"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CVData } from "@/types/cv";
import { Dictionary } from "@/lib/i18n/dictionaries";

interface Props {
  dict: Dictionary;
  forceCollapsed?: boolean | null;
}

export function SummarySection({ dict, forceCollapsed }: Props) {
  const { register } = useFormContext<CVData>();
  const [collapsed, setCollapsed] = useState(true);
  const effectiveCollapsed = forceCollapsed ?? collapsed;

  return (
    <div className="bg-surface-container-lowest rounded-3xl shadow-card">
      <div className="flex items-center justify-between px-spacing-lg py-4 border-b border-outline-variant/30">
        <div className="flex items-center gap-2 font-title-sm text-title-sm text-on-surface">
          <span className="material-symbols-outlined text-[18px]">
            edit_note
          </span>
          {dict.form.summary}
        </div>
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
      <div
        className={`overflow-hidden transition-all duration-300 ${
          !effectiveCollapsed ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-spacing-lg space-y-3">
          <div>
            <label className="font-label-xs text-label-xs text-on-surface-variant uppercase mb-1.5 block">
              {dict.fields.summaryEs}
            </label>
            <textarea
              {...register("summary.es", {
                required: dict.validation.required,
              })}
              rows={3}
              className="input-field resize-none"
            />
          </div>
          <div>
            <label className="font-label-xs text-label-xs text-on-surface-variant uppercase mb-1.5 block">
              {dict.fields.summaryEn}
            </label>
            <textarea
              {...register("summary.en")}
              rows={3}
              className="input-field resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
