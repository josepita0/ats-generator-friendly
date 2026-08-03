"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CVData } from "@/types/cv";
import { Dictionary } from "@/lib/i18n/dictionaries";

interface Props {
  dict: Dictionary;
}

export function PersonalInfoSection({ dict }: Props) {
  const {
    register,
    formState: { errors: formErrors },
  } = useFormContext<CVData>();
  const e = formErrors.personalInfo;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="section-card">
      <div className="section-header rounded-t-lg">
        <div className="section-header-title">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2c0 .66.54 1.2 1.2 1.2h16.8c.66 0 1.2-.54 1.2-1.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
          {dict.form.personalInfo}
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
          <div className="section-body rounded-b-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="px-label">{dict.fields.name}</label>
                <input
                  {...register("personalInfo.name", {
                    required: dict.validation.required,
                  })}
                  className="px-input"
                />
                {e?.name && (
                  <p className="text-xs text-red-700 font-bold mt-0.5">
                    {e.name.message as string}
                  </p>
                )}
              </div>
              <div>
                <label className="px-label">{dict.fields.email}</label>
                <input
                  type="email"
                  {...register("personalInfo.email", {
                    required: dict.validation.required,
                  })}
                  className="px-input"
                />
                {e?.email && (
                  <p className="text-xs text-red-700 font-bold mt-0.5">
                    {e.email.message as string}
                  </p>
                )}
              </div>
              <div>
                <label className="px-label">{dict.fields.phone}</label>
                <input
                  {...register("personalInfo.phone", {
                    required: dict.validation.required,
                  })}
                  className="px-input"
                />
              </div>
              <div>
                <label className="px-label">{dict.fields.location}</label>
                <input
                  {...register("personalInfo.location", {
                    required: dict.validation.required,
                  })}
                  className="px-input"
                />
              </div>
              <div>
                <label className="px-label">{dict.fields.linkedin}</label>
                <input
                  {...register("personalInfo.linkedin")}
                  className="px-input"
                />
              </div>
              <div>
                <label className="px-label">{dict.fields.website}</label>
                <input
                  {...register("personalInfo.website")}
                  className="px-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
