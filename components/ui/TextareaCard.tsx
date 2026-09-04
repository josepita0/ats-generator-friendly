"use client";

import { forwardRef, useId } from "react";

interface TextareaCardProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  minHeight?: string;
}

export const TextareaCard = forwardRef<HTMLTextAreaElement, TextareaCardProps>(
  ({ label, error, minHeight = "120px", className = "", ...props }, ref) => {
    const id = useId();

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={id}
          className="font-label-xs text-[0.70rem] text-on-surface-variant  tracking-wider"
        >
          {label}
        </label>

        <textarea
          ref={ref}
          id={id}
          style={{ minHeight }}
          className={`
            w-full px-3.5 py-2.5
            bg-surface-container-lowest
            border border-outline-variant/40
            rounded-xl
            font-body-md text-body-md text-on-surface
            placeholder:text-on-surface-variant
            transition-all duration-200
            focus:outline-none focus:border-primary focus:bg-surface-container-lowest focus:shadow-sm
            disabled:bg-surface-container disabled:cursor-not-allowed
            resize-none
            ${error ? "border-error bg-error-container/10" : ""}
            ${className}
          `}
          {...props}
        />

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

TextareaCard.displayName = "TextareaCard";
