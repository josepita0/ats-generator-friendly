'use client';

import { useRef } from 'react';

interface Props {
  onExport: () => void;
  onImport: (file: File) => Promise<boolean>;
}

export function BackupCard({ onExport, onImport }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await onImport(file);
      if (success) {
        alert('Backup importado correctamente. Recarga la página para ver los cambios.');
      } else {
        alert('Error al importar el archivo. Verifica que sea un backup válido de Avora.');
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="card">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-[1.5rem] text-primary">
            folder_zip
          </span>
        </div>
        <div className="flex-1">
          <h3 className="font-title-md text-[1rem] font-semibold text-on-surface mb-0.5">
            Copia de Seguridad de tus CVs
          </h3>
          <p className="font-body-sm text-on-surface-variant">
            Portabilidad universal en formato estándar
          </p>
        </div>
      </div>

      <p className="font-body-sm text-on-surface-variant mb-4">
        Exporta todos tus datos incluyendo versiones en español e inglés. El
        archivo JSON generado es compatible con estándares de la industria.
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        <span className="chip chip-inactive">
          <span className="material-symbols-outlined text-[0.75rem]">check</span>
          JSONResume v1.0.0
        </span>
        <span className="chip chip-inactive">
          <span className="material-symbols-outlined text-[0.75rem]">check</span>
          Schema Avora
        </span>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onExport}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[1.125rem]">
            download
          </span>
          Exportar datos a JSON (ES + EN)
        </button>

        <button
          type="button"
          onClick={handleImportClick}
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[1.125rem]">
            upload
          </span>
          Importar backup JSON (Restaurar)
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Seleccionar archivo JSON para importar"
        />
      </div>
    </div>
  );
}
