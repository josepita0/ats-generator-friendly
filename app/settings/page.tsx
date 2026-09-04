"use client";

import { useSettings } from "@/hooks/useSettings";
import { PrivacyGuaranteeCard } from "@/components/settings/PrivacyGuaranteeCard";
import { GeminiApiConfig } from "@/components/settings/GeminiApiConfig";
import { BackupCard } from "@/components/settings/BackupCard";
import { StorageQuotaCard } from "@/components/settings/StorageQuotaCard";
import { PrivacyFooterBadge } from "@/components/settings/PrivacyFooterBadge";

export default function SettingsPage() {
  const settings = useSettings();

  return (
    <div className="min-h-screen">
      <div className="px-[1.25rem] py-8 lg:px-[3rem] lg:py-12">
        {/* Hero Section */}
        <div className="mb-8 lg:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-headline-xl text-[2rem] lg:text-[2.5rem] font-medium text-primary mb-2">
                Ajustes y Privacidad
              </h1>
              <p className="font-body-lg text-on-surface-variant max-w-2xl">
                Control soberano de tus credenciales, modelos y datos. Todo
                ocurre en tu navegador.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="badge badge-success">
                <span className="material-symbols-outlined text-[0.625rem]">
                  check
                </span>
                100% Local / Zero-Server
              </span>
              <span className="badge badge-success">
                <span className="material-symbols-outlined text-[0.625rem]">
                  lock
                </span>
                Privacidad Criptográfica
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-surface-container-low/70 rounded-full px-4 py-2">
              <span className="material-symbols-outlined text-[1rem] text-primary">
                translate
              </span>
              <span className="font-label-sm text-on-surface">
                2 Versiones Activas
              </span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-low/70 rounded-full px-4 py-2">
              <span className="material-symbols-outlined text-[1rem] text-primary">
                database
              </span>
              <span className="font-label-sm text-on-surface">
                IndexedDB Local
              </span>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Privacy + Config (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            <PrivacyGuaranteeCard />
            <GeminiApiConfig
              apiKey={settings.apiKey}
              setApiKey={settings.setApiKey}
              selectedModel={settings.selectedModel}
              setSelectedModel={settings.setSelectedModel}
              atsTone={settings.atsTone}
              setAtsTone={settings.setAtsTone}
              isTestingConnection={settings.isTestingConnection}
              connectionStatus={settings.connectionStatus}
              testConnection={settings.testConnection}
            />
          </div>

          {/* Right column - Backup + Storage (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            <BackupCard
              onExport={settings.handleExport}
              onImport={settings.handleImport}
            />
            <StorageQuotaCard
              storageUsage={settings.storageUsage}
              onClearStorage={settings.handleClearStorage}
            />
            <PrivacyFooterBadge />
          </div>
        </div>
      </div>
    </div>
  );
}
