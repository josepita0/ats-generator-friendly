'use client';

import { useState } from 'react';
import { GeminiModel, ATSTone } from '@/hooks/useSettings';

interface Props {
  apiKey: string;
  setApiKey: (key: string) => void;
  selectedModel: GeminiModel;
  setSelectedModel: (model: GeminiModel) => void;
  atsTone: ATSTone;
  setAtsTone: (tone: ATSTone) => void;
  isTestingConnection: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'testing';
  testConnection: () => Promise<void>;
}

const MODEL_OPTIONS: Array<{
  id: GeminiModel;
  icon: string;
  name: string;
  badge: string;
  description: string;
}> = [
  {
    id: 'flash',
    icon: 'bolt',
    name: 'Gemini 1.5 Flash',
    badge: 'Recomendado • Rápido y eficiente',
    description:
      'Ideal para borradores rápidos y ediciones frecuentes. Respuesta ágil.',
  },
  {
    id: 'pro',
    icon: 'auto_awesome',
    name: 'Gemini 1.5 Pro',
    badge: 'Máximo detalle • Redacción avanzada',
    description:
      'Para resultados de alta calidad con razonamiento profundo y precisión.',
  },
];

const TONE_OPTIONS: Array<{
  id: ATSTone;
  label: string;
}> = [
  { id: 'quantitative', label: 'Cuantitativo ATS' },
  { id: 'concise', label: 'Conciso Directo' },
  { id: 'executive', label: 'Ejecutivo C-Level' },
];

export function GeminiApiConfig({
  apiKey,
  setApiKey,
  selectedModel,
  setSelectedModel,
  atsTone,
  setAtsTone,
  isTestingConnection,
  connectionStatus,
  testConnection,
}: Props) {
  const [showApiKey, setShowApiKey] = useState(false);

  const statusConfig = {
    connected: {
      label: 'Conectada (Válida)',
      icon: 'check_circle',
      badgeClass: 'badge-success',
    },
    disconnected: {
      label: 'No configurada',
      icon: 'error',
      badgeClass: 'badge-error',
    },
    testing: {
      label: 'Verificando...',
      icon: 'sync',
      badgeClass: 'badge-warning',
    },
  };

  const status = statusConfig[connectionStatus];

  return (
    <div className="space-y-6">
      {/* API Key Configuration */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[1.25rem] text-primary">
              psychology
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-title-md text-[1rem] font-semibold text-on-surface">
              Configuración Gemini API
            </h3>
          </div>
          <span className={`badge ${status.badgeClass}`}>
            <span className="material-symbols-outlined text-[0.625rem]">
              {status.icon}
            </span>
            {status.label}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-label-sm text-on-surface-variant mb-2 block">
              API Key
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIza..."
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  aria-label={showApiKey ? 'Ocultar clave' : 'Mostrar clave'}
                >
                  <span className="material-symbols-outlined text-[1.25rem]">
                    {showApiKey ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <button
                type="button"
                onClick={testConnection}
                disabled={isTestingConnection || !apiKey}
                className="btn-secondary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTestingConnection ? (
                  <span className="material-symbols-outlined text-[1.125rem] animate-spin">
                    sync
                  </span>
                ) : (
                  'Probar'
                )}
              </button>
            </div>
          </div>

          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-primary font-label-sm font-semibold hover:underline"
          >
            Obtener API Key gratis
            <span className="material-symbols-outlined text-[0.875rem]">
              open_in_new
            </span>
          </a>

          <p className="font-body-xs text-on-surface-variant bg-surface-container-low/50 rounded-xl p-3">
            Tu API key se almacena únicamente en localStorage de este navegador.
            Nunca se envía a ningún servidor propio.
          </p>
        </div>
      </div>

      {/* Model Selection */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[1.25rem] text-primary">
              smart_toy
            </span>
          </div>
          <h3 className="font-title-md text-[1rem] font-semibold text-on-surface">
            Modelo de Inferencia
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MODEL_OPTIONS.map((model) => {
            const isSelected = selectedModel === model.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => setSelectedModel(model.id)}
                className={`
                  text-left p-4 rounded-2xl border transition-all
                  ${
                    isSelected
                      ? 'bg-secondary-container/40 border-primary/40'
                      : 'bg-surface-container-low/70 border-transparent hover:bg-surface-container'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`material-symbols-outlined text-[1.25rem] mt-0.5 ${
                      isSelected ? 'text-primary' : 'text-on-surface-variant'
                    }`}
                  >
                    {model.icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-label-sm font-semibold text-on-surface">
                        {model.name}
                      </p>
                      {isSelected && (
                        <span className="material-symbols-outlined text-[0.875rem] text-primary">
                          check_circle
                        </span>
                      )}
                    </div>
                    <p className="font-body-xs text-on-surface-variant mb-1.5">
                      {model.badge}
                    </p>
                    <p className="font-body-xs text-on-surface-variant/80">
                      {model.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ATS Tone Selection */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[1.25rem] text-primary">
              tune
            </span>
          </div>
          <h3 className="font-title-md text-[1rem] font-semibold text-on-surface">
            Tono de Redacción ATS
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {TONE_OPTIONS.map((tone) => {
            const isActive = atsTone === tone.id;
            return (
              <button
                key={tone.id}
                type="button"
                onClick={() => setAtsTone(tone.id)}
                className={`chip ${isActive ? 'chip-active' : 'chip-inactive'}`}
              >
                {isActive && (
                  <span className="material-symbols-outlined text-[0.875rem]">
                    check
                  </span>
                )}
                {tone.label}
              </button>
            );
          })}
        </div>

        <p className="font-body-xs text-on-surface-variant mt-3">
          {atsTone === 'quantitative' &&
            'Enfocado en métricas, porcentajes y resultados numéricos. Ideal para roles técnicos y de gestión.'}
          {atsTone === 'concise' &&
            'Máxima concisión con impacto directo. Perfecto para ejecutivos y managers senior.'}
          {atsTone === 'executive' &&
            'Lenguaje ejecutivo con enfoque estratégico y liderazgo. Para posiciones C-Level y directivas.'}
        </p>
      </div>
    </div>
  );
}
