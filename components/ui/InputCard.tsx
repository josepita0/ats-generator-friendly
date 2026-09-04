"use client";

import { forwardRef, useId } from "react";

interface InputCardProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: string;
}

export const InputCard = forwardRef<HTMLInputElement, InputCardProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    const id = useId();

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={id}
          className="font-label-xs text-[0.70rem] text-on-surface-variant  tracking-wider"
        >
          {label}
        </label>

        <div className="relative">
          {icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            className={`
              w-full h-[46px] px-3.5 ${icon ? "pl-10" : ""}
              bg-surface-container-lowest
              border border-outline-variant/40
              rounded-xl
              font-body-md text-body-md text-on-surface
              placeholder:text-on-surface-variant
              transition-all duration-200
              focus:outline-none focus:border-primary focus:bg-surface-container-lowest focus:shadow-sm
              disabled:bg-surface-container disabled:cursor-not-allowed
              ${error ? "border-error bg-error-container/10" : ""}
              ${className}
            `}
            {...props}
          />
        </div>

        {error && (
          <p className="font-label-xs text-label-xs text-error flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {error}
          </p>
        )}
      </div>
    );
  },
);

InputCard.displayName = "InputCard";
