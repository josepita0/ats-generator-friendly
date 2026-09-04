'use client';

import { useMemo } from 'react';
import { Dictionary } from '@/lib/i18n/dictionaries';

const MONTH_VALUES = [
  '01', '02', '03', '04', '05', '06',
  '07', '08', '09', '10', '11', '12',
];

interface MonthYearPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  dict: Dictionary;
}

export function MonthYearPicker({ value = '', onChange, onBlur, dict }: MonthYearPickerProps) {
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = 1970; y <= currentYear; y++) {
      arr.push(y);
    }
    return arr;
  }, [currentYear]);

  const months = useMemo(() => {
    return MONTH_VALUES.map((val, i) => ({
      value: val,
      label: dict.months[i],
    }));
  }, [dict.months]);

  const parts = value ? value.split(/[\/-]/) : [];
  let selectedMonth = '';
  let selectedYear = '';

  if (parts.length === 2) {
    if (parts[0].length === 4) {
      selectedYear = parts[0];
      selectedMonth = parts[1];
    } else {
      selectedMonth = parts[0];
      selectedYear = parts[1];
    }
  }

  const handleYearChange = (year: string) => {
    if (!onChange) return;
    if (year && selectedMonth) {
      onChange(`${selectedMonth}/${year}`);
    } else {
      onChange('');
    }
  };

  const handleMonthChange = (month: string) => {
    if (!onChange) return;
    if (month && selectedYear) {
      onChange(`${month}/${selectedYear}`);
    } else {
      onChange('');
    }
  };

  return (
    <div className="flex gap-2">
      <select
        value={selectedMonth}
        onChange={(e) => handleMonthChange(e.target.value)}
        onBlur={onBlur}
        className="input-field w-full text-sm"
      >
        <option value="">{dict.form.month}</option>
        {months.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>
      <select
        value={selectedYear}
        onChange={(e) => handleYearChange(e.target.value)}
        onBlur={onBlur}
        className="input-field w-full text-sm"
      >
        <option value="">{dict.form.year}</option>
        {years.map((y) => (
          <option key={y} value={String(y)}>{y}</option>
        ))}
      </select>
    </div>
  );
}
