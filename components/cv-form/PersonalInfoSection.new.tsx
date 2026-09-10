'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import type { CVData } from '@/types/cv';
import { InputCard } from '@/components/ui';

export function PersonalInfoSectionNew() {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<CVData>();

  const personalInfoErrors = errors.personalInfo;
  const generateQR = useWatch({
    control,
    name: 'personalInfo.generateQR',
  });
  const showQRTitle = useWatch({
    control,
    name: 'personalInfo.showQRTitle',
  });

  return (
    <div className="space-y-6">
      {/* Nombre completo */}
      <InputCard
        label="Nombre completo"
        icon="person"
        placeholder="Ej: Jos├⌐ Alejandro Acurero"
        {...register('personalInfo.name')}
        error={personalInfoErrors?.name?.message}
      />

      {/* Email y tel├⌐fono en grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputCard
          label="Email"
          type="email"
          icon="email"
          placeholder="tu@email.com"
          {...register('personalInfo.email')}
          error={personalInfoErrors?.email?.message}
        />

        <InputCard
          label="Tel├⌐fono"
          type="tel"
          icon="phone"
          placeholder="+54 11 1234-5678"
          {...register('personalInfo.phone')}
          error={personalInfoErrors?.phone?.message}
        />
      </div>

      {/* Ubicaci├│n */}
      <InputCard
        label="Ubicaci├│n"
        icon="location_on"
        placeholder="Ciudad, Pa├¡s"
        {...register('personalInfo.location')}
        error={personalInfoErrors?.location?.message}
      />

      {/* LinkedIn y website en grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputCard
          label="LinkedIn"
          icon="link"
          placeholder="linkedin.com/in/tu-perfil"
          {...register('personalInfo.linkedin')}
          error={personalInfoErrors?.linkedin?.message}
        />

        <div className="space-y-3">
          <InputCard
            label="Sitio web"
            icon="language"
            placeholder="tuportfolio.com"
            {...register('personalInfo.website')}
            error={personalInfoErrors?.website?.message}
          />
          <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg border border-primary/20">
            <input
              type="checkbox"
              id="generateQR"
              {...register('personalInfo.generateQR')}
              className="w-5 h-5 rounded border-2 border-primary text-primary focus:ring-2 focus:ring-primary/30 cursor-pointer"
            />
            <label 
              htmlFor="generateQR"
              className="text-sm text-on-surface font-medium cursor-pointer select-none"
            >
              Generar QR
            </label>
          </div>
          {generateQR && (
            <>
              <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg border border-primary/20">
                <input
                  type="checkbox"
                  id="showQRTitle"
                  {...register('personalInfo.showQRTitle')}
                  className="w-5 h-5 rounded border-2 border-primary text-primary focus:ring-2 focus:ring-primary/30 cursor-pointer"
                />
                <label 
                  htmlFor="showQRTitle"
                  className="text-sm text-on-surface font-medium cursor-pointer select-none"
                >
                  ¿Desea agregar título?
                </label>
              </div>
              {showQRTitle && (
                <InputCard
                  label="Etiqueta del QR"
                  icon="label"
                  placeholder="Sitio web"
                  {...register('personalInfo.qrLabel')}
                  error={personalInfoErrors?.qrLabel?.message}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}