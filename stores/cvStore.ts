import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CVData, Language } from '@/types/cv';

export type GeminiModel = 'flash' | 'pro';
export type ATSTone = 'quantitative' | 'concise' | 'executive';

interface CVState {
  cvData: CVData | null;
  language: Language;
  jobDescription: string;
  selectedModel: GeminiModel;
  atsTone: ATSTone;
  apiKey: string;
  /** Monotonically increasing counter — incremented on every setCVData call.
   *  Used by useCVForm to detect external store changes without relying on
   *  the `values` prop of useForm (which causes focus loss on re-init). */
  dataVersion: number;

  setCVData: (data: CVData) => void;
  updateCVData: (data: Partial<CVData>) => void;
  setLanguage: (lang: Language) => void;
  setJobDescription: (desc: string) => void;
  setSelectedModel: (model: GeminiModel) => void;
  setAtsTone: (tone: ATSTone) => void;
  setApiKey: (key: string) => void;
  clearAll: () => void;
}

export const useCVStore = create<CVState>()(
  persist(
    (set) => ({
      cvData: null,
      language: 'es',
      jobDescription: '',
      selectedModel: 'flash',
      atsTone: 'quantitative',
      apiKey: '',
      dataVersion: 0,

      setCVData: (data) => set((state) => ({ cvData: data, dataVersion: state.dataVersion + 1 })),
      updateCVData: (data) =>
        set((state) => ({
          cvData: state.cvData ? { ...state.cvData, ...data } : (data as CVData),
        })),
      setLanguage: (lang) => set({ language: lang }),
      setJobDescription: (desc) => set({ jobDescription: desc }),
      setSelectedModel: (model) => set({ selectedModel: model }),
      setAtsTone: (tone) => set({ atsTone: tone }),
      setApiKey: (key) => set({ apiKey: key }),
      clearAll: () =>
        set({
          cvData: null,
          language: 'es',
          jobDescription: '',
          selectedModel: 'flash',
          atsTone: 'quantitative',
          apiKey: '',
        }),
    }),
    {
      name: 'avora-storage',
      partialize: (state) => ({
        cvData: state.cvData,
        language: state.language,
        jobDescription: state.jobDescription,
        selectedModel: state.selectedModel,
        atsTone: state.atsTone,
        apiKey: state.apiKey,
        // dataVersion intentionally excluded — runtime counter, not persisted
      }),
    },
  ),
);
