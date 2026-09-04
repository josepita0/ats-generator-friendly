'use client';

import { useState, KeyboardEvent } from 'react';

interface ChipInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  error?: string;
}

export function ChipInput({
  label,
  values,
  onChange,
  placeholder = 'Type and press Enter',
  error,
}: ChipInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newValue = inputValue.trim();
      if (!values.includes(newValue)) {
        onChange([...values, newValue]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  const removeChip = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-1.5">
      <label className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider">
        {label}
      </label>

      <div
        className={`
          min-h-[52px] px-3 py-2
          bg-surface-container-lowest
          border border-outline-variant/40
          rounded-2xl
          transition-all duration-200
          focus-within:border-primary focus-within:bg-surface-container-lowest focus-within:shadow-sm
          ${error ? 'border-error bg-error-container/10' : ''}
        `}
      >
        <div className="flex flex-wrap gap-1.5">
          {values.map((value, index) => (
            <span
              key={index}
              className="
                inline-flex items-center gap-1
                px-2.5 py-0.5
                bg-primary-container/30
                text-primary
                font-label-xs text-label-xs
                rounded-full
                transition-colors duration-150
                hover:bg-primary-container/50
              "
            >
              {value}
              <button
                type="button"
                onClick={() => removeChip(index)}
                className="min-w-[24px] min-h-[24px] flex items-center justify-center material-symbols-outlined text-[12px] hover:text-error transition-colors rounded-full hover:bg-error-container/10"
                aria-label={`Remove ${value}`}
              >
                close
              </button>
            </span>
          ))}

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={values.length === 0 ? placeholder : ''}
            className="
              flex-1 min-w-[120px]
              bg-transparent
              font-body-md text-body-md text-on-surface
              placeholder:text-on-surface-variant
              focus:outline-none
            "
          />
        </div>
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
