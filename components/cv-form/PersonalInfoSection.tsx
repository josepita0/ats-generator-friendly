"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CVData } from "@/types/cv";
import { Dictionary } from "@/lib/i18n/dictionaries";

interface Props {
  dict: Dictionary;
  forceCollapsed?: boolean | null;
}

export function PersonalInfoSection({ dict, forceCollapsed }: Props) {
  const {
    register,
    formState: { errors: formErrors },
  } = useFormContext<CVData>();
  const e = formErrors.personalInfo;
  const [collapsed, setCollapsed] = useState(false);
  const effectiveCollapsed = forceCollapsed ?? collapsed;

  return (
    <div className="bg-surface-container-lowest rounded-3xl shadow-card">
      <div className="flex items-center justify-between px-spacing-lg py-4 border-b border-outline-variant/30">
        <div className="flex items-center gap-2 font-title-sm text-title-sm text-on-surface">
          <span className="material-symbols-outlined text-[18px]">badge</span>
          {dict.form.personalInfo}
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
          !effectiveCollapsed
            ? "max-h-[600px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-spacing-lg">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7">
              <label className="font-label-xs text-label-xs text-on-surface-variant uppercase mb-1.5 block">
                {dict.fields.name}
              </label>
              <input
                {...register("personalInfo.name", {
                  required: dict.validation.required,
                })}
                className="input-field"
              />
              {e?.name && (
                <p className="text-xs text-error mt-0.5 font-label-xs">
                  {e.name.message as string}
                </p>
              )}
            </div>
            <div className="sm:col-span-5">
              <label className="font-label-xs text-label-xs text-on-surface-variant uppercase mb-1.5 block">
                {dict.fields.phone}
              </label>
              <input
                {...register("personalInfo.phone", {
                  required: dict.validation.required,
                })}
                className="input-field"
              />
            </div>
            <div className="sm:col-span-7">
              <label className="font-label-xs text-label-xs text-on-surface-variant uppercase mb-1.5 block">
                {dict.fields.email}
              </label>
              <input
                type="email"
                {...register("personalInfo.email", {
                  required: dict.validation.required,
                })}
                className="input-field"
              />
              {e?.email && (
                <p className="text-xs text-error mt-0.5 font-label-xs">
                  {e.email.message as string}
                </p>
              )}
            </div>
            <div className="sm:col-span-5">
              <label className="font-label-xs text-label-xs text-on-surface-variant uppercase mb-1.5 block">
                {dict.fields.location}
              </label>
              <input
                {...register("personalInfo.location", {
                  required: dict.validation.required,
                })}
                className="input-field"
              />
            </div>
            <div className="sm:col-span-6">
              <label className="font-label-xs text-label-xs text-on-surface-variant uppercase mb-1.5 block">
                {dict.fields.linkedin}
              </label>
              <input
                {...register("personalInfo.linkedin")}
                className="input-field"
              />
            </div>
            <div className="sm:col-span-6">
              <label className="font-label-xs text-label-xs text-on-surface-variant uppercase mb-1.5 block">
                {dict.fields.website}
              </label>
              <input
                {...register("personalInfo.website")}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
