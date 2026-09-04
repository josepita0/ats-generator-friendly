'use client';

import { forwardRef, useId } from 'react';

interface SelectCardProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const SelectCard = forwardRef<HTMLSelectElement, SelectCardProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    const id = useId();

    return (
      <div className="space-y-1.5">
        <label htmlFor={id} className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider">
          {label}
        </label>

        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={`
              w-full h-[46px] px-3.5 pr-10
              bg-surface-container-lowest
              border border-outline-variant/40
              rounded-xl
              font-body-md text-body-md text-on-surface
              transition-all duration-200
              focus:outline-none focus:border-primary focus:bg-surface-container-lowest focus:shadow-sm
              disabled:bg-surface-container disabled:cursor-not-allowed
              appearance-none cursor-pointer
              ${error ? 'border-error bg-error-container/10' : ''}
              ${className}
            `}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px] pointer-events-none">
            expand_more
          </span>
        </div>

        {error && (
          <p className="font-label-xs text-label-xs text-error flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

SelectCard.displayName = 'SelectCard';
