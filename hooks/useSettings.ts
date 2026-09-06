'use client';

import { useState, useEffect, useCallback } from 'react';
import { CVData } from '@/types/cv';
import { useCVStore, type GeminiModel, type ATSTone } from '@/stores/cvStore';

// Re-export for backward compatibility (used by GeminiApiConfig)
export type { GeminiModel, ATSTone };

const CV_DATA_KEY = 'ats-cv-data';
const COVER_LETTER_KEY = 'ats-cover-letter';



function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    console.warn(`Failed to save to localStorage key: ${key}`);
  }
}

export function useSettings() {
  // ── Store-backed settings ────────────────────────
  const apiKey = useCVStore((s) => s.apiKey);
  const setStoreApiKey = useCVStore((s) => s.setApiKey);
  const selectedModel = useCVStore((s) => s.selectedModel);
  const setStoreSelectedModel = useCVStore((s) => s.setSelectedModel);
  const atsTone = useCVStore((s) => s.atsTone);
  const setStoreAtsTone = useCVStore((s) => s.setAtsTone);
  // ── UI-only state ────────────────────────────────
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'disconnected' | 'testing'
  >('disconnected');

  // ── Connection test ──────────────────────────────
  const testConnection = useCallback(async () => {
    if (!apiKey) {
      setConnectionStatus('disconnected');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('testing');

    try {
      const response = await fetch('/api/ai/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });

      if (response.ok) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    } catch {
      setConnectionStatus('disconnected');
    } finally {
      setIsTestingConnection(false);
    }
  }, [apiKey]);

  useEffect(() => {
    // Auto-verify connection on mount if API key exists
    if (apiKey) {
      testConnection(); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [testConnection, apiKey]);

  // ── Settings setters (delegate to store) ─────────
  const setApiKey = useCallback((key: string) => {
    setStoreApiKey(key);
    if (key) {
      setConnectionStatus('disconnected');
    } else {
      setConnectionStatus('disconnected');
    }
  }, [setStoreApiKey]);

  const setSelectedModel = useCallback((model: GeminiModel) => {
    setStoreSelectedModel(model);
  }, [setStoreSelectedModel]);

  const setAtsTone = useCallback((tone: ATSTone) => {
    setStoreAtsTone(tone);
  }, [setStoreAtsTone]);

  // ── Backup / Export ──────────────────────────────
  const handleExport = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const cvData = readStorage<CVData | null>(CV_DATA_KEY, null);
      const coverLetter = readStorage<Record<string, unknown> | null>(
        COVER_LETTER_KEY,
        null
      );

      const exportData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        application: 'Avora',
        data: {
          cv: cvData,
          coverLetter: coverLetter,
        },
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `avora-backup-${
        new Date().toISOString().split('T')[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      console.error('Failed to export data');
    }
  }, []);

  const handleImport = useCallback((file: File) => {
    return new Promise<boolean>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);

          if (!parsed.application || parsed.application !== 'Avora') {
            console.error('Invalid backup format');
            resolve(false);
            return;
          }

          if (parsed.data?.cv) {
            writeStorage(CV_DATA_KEY, JSON.stringify(parsed.data.cv));
          }
          if (parsed.data?.coverLetter) {
            writeStorage(
              COVER_LETTER_KEY,
              JSON.stringify(parsed.data.coverLetter)
            );
          }

          resolve(true);
        } catch {
          console.error('Failed to parse JSON file');
          resolve(false);
        }
      };
      reader.onerror = () => resolve(false);
      reader.readAsText(file);
    });
  }, []);

  return {
    apiKey,
    setApiKey,
    selectedModel,
    setSelectedModel,
    atsTone,
    setAtsTone,
    isTestingConnection,
    connectionStatus,
    testConnection,
    handleExport,
    handleImport,
  };
}
