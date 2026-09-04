'use client';

export type PaperSize = 'A4' | 'LETTER';
export type MarginPreset = 'STANDARD' | 'COMPACT';
export type FontScale = '10' | '10.5' | '11';

interface Props {
  paperSize: PaperSize;
  onPaperSizeChange: (v: PaperSize) => void;
  marginPreset: MarginPreset;
  onMarginPresetChange: (v: MarginPreset) => void;
  fontScale: FontScale;
  onFontScaleChange: (v: FontScale) => void;
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  labels: Record<T, string>;
}) {
  return (
    <div className="flex gap-1">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`chip text-[0.6875rem] cursor-pointer transition-colors ${
            value === opt ? 'chip-active' : 'chip-inactive'
          }`}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}

export function LayoutParameters({
  paperSize,
  onPaperSizeChange,
  marginPreset,
  onMarginPresetChange,
  fontScale,
  onFontScaleChange,
}: Props) {
  return (
    <div>
      <h3 className="text-[0.75rem] font-semibold text-on-surface font-label-sm uppercase tracking-wider mb-3">
        Maquetación
      </h3>

      <div className="space-y-3">
        {/* Paper size */}
        <div>
          <p className="text-[0.6875rem] text-on-surface-variant font-label-xs mb-1.5">
            Tamaño de Hoja
          </p>
          <SegmentedControl
            options={['A4', 'LETTER'] as const}
            value={paperSize}
            onChange={onPaperSizeChange}
            labels={{ A4: 'A4 (210×297mm)', LETTER: 'Letter (8.5×11")' }}
          />
        </div>

        {/* Margins */}
        <div>
          <p className="text-[0.6875rem] text-on-surface-variant font-label-xs mb-1.5">
            Márgenes de Impresión
          </p>
          <SegmentedControl
            options={['STANDARD', 'COMPACT'] as const}
            value={marginPreset}
            onChange={onMarginPresetChange}
            labels={{ STANDARD: 'Estándar 0.75"', COMPACT: 'Compacto 0.50"' }}
          />
        </div>

        {/* Font scale */}
        <div>
          <p className="text-[0.6875rem] text-on-surface-variant font-label-xs mb-1.5">
            Escala Tipográfica de Cuerpo
          </p>
          <SegmentedControl
            options={['10', '10.5', '11'] as const}
            value={fontScale}
            onChange={onFontScaleChange}
            labels={{ '10': '10pt', '10.5': '10.5pt', '11': '11pt' }}
          />
        </div>
      </div>
    </div>
  );
}
