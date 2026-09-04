'use client';

import { useFormContext } from 'react-hook-form';
import type { CVData } from '@/types/cv';
import { InputCard } from '@/components/ui';

export function PersonalInfoSectionNew() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CVData>();

  const personalInfoErrors = errors.personalInfo;

  return (
    <div className="space-y-6">
      {/* Nombre completo */}
      <InputCard
        label="Nombre completo"
        icon="person"
        placeholder="Ej: José Alejandro Acurero"
        {...register('personalInfo.name')}
        error={personalInfoErrors?.name?.message}
      />

      {/* Email y teléfono en grid */}
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
          label="Teléfono"
          type="tel"
          icon="phone"
          placeholder="+54 11 1234-5678"
          {...register('personalInfo.phone')}
          error={personalInfoErrors?.phone?.message}
        />
      </div>

      {/* Ubicación */}
      <InputCard
        label="Ubicación"
        icon="location_on"
        placeholder="Ciudad, País"
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

        <InputCard
          label="Sitio web"
          icon="language"
          placeholder="tuportfolio.com"
          {...register('personalInfo.website')}
          error={personalInfoErrors?.website?.message}
        />
      </div>
    </div>
  );
}
