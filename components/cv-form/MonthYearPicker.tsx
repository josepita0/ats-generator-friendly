'use client';

import { useMemo } from 'react';

const MONTHS = [
  { value: '01', label: 'Ene' },
  { value: '02', label: 'Feb' },
  { value: '03', label: 'Mar' },
  { value: '04', label: 'Abr' },
  { value: '05', label: 'May' },
  { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' },
  { value: '08', label: 'Ago' },
  { value: '09', label: 'Sep' },
  { value: '10', label: 'Oct' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Dic' },
];

interface MonthYearPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
}

export function MonthYearPicker({ value = '', onChange, onBlur }: MonthYearPickerProps) {
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = 1970; y <= currentYear; y++) {
      arr.push(y);
    }
    return arr;
  }, [currentYear]);

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
        className="retro-input p-2 w-full text-sm"
      >
        <option value="">Mes</option>
        {MONTHS.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>
      <select
        value={selectedYear}
        onChange={(e) => handleYearChange(e.target.value)}
        onBlur={onBlur}
        className="retro-input p-2 w-full text-sm"
      >
        <option value="">Año</option>
        {years.map((y) => (
          <option key={y} value={String(y)}>{y}</option>
        ))}
      </select>
    </div>
  );
}
