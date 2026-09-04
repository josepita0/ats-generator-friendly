import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CVData } from "@/types/cv";
import { Suggestion } from "@/types/chat";
import { cvDataSchema } from "@/lib/cv/schemas";
import { createEmptyCVData } from "@/lib/cv/defaults";
import { replaceBulletInDescriptions } from "@/lib/cv/descriptions";
import { normalizeDates } from "@/lib/cv/normalize";
import { generateCvPdf } from "@/lib/pdf/generate";
import { es, en, Dictionary } from "@/lib/i18n/dictionaries";
import { useCVStore } from "@/stores/cvStore";

export type MobileTab = "editor" | "generate";

const dictionaries = { es, en };

/**
 * Deep equality check for CVData (JSON-serializable objects).
 * Used to detect whether the store changed due to the form's own debounced
 * sync (same values) or due to an external mutation (import, translation, etc.).
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== "object" || typeof b !== "object") return false;

  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (
      !deepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      )
    ) {
      return false;
    }
  }
  return true;
}

export function useCVForm() {
  const [mounted, setMounted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<MobileTab>("editor");
  const [collapseAll, setCollapseAll] = useState<boolean | null>(null);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [generateSubTab, setGenerateSubTab] = useState<"pdf" | "cover-letter">(
    "pdf",
  );
  const [coverLetterVersion, setCoverLetterVersion] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // ── Store selectors ──────────────────────────────
  const storeCvData = useCVStore((s) => s.cvData);
  const setStoreCVData = useCVStore((s) => s.setCVData);
  const storeLanguage = useCVStore((s) => s.language);
  const setStoreLanguage = useCVStore((s) => s.setLanguage);
  const storeJobDescription = useCVStore((s) => s.jobDescription);
  const setStoreJobDescription = useCVStore((s) => s.setJobDescription);
  const dataVersion = useCVStore((s) => s.dataVersion);

  // ── Stable empty data reference ──────────────────
  const emptyCVData = useMemo(() => createEmptyCVData(), []);

  // Derive default values: normalize store data or use empty fallback.
  const defaultValues = useMemo(() => {
    return storeCvData ? normalizeDates(storeCvData) : emptyCVData;
  }, [storeCvData, emptyCVData]);

  // ── react-hook-form (NO `values` prop) ───────────
  // The `values` prop causes RHF to re-initialize the entire form state
  // whenever the reference changes, which resets focus. Instead, we use
  // `defaultValues` for initialization and `reset()` only for genuine
  // external changes (import, translation, language switch).
  const methods = useForm<CVData>({
    resolver: zodResolver(cvDataSchema),
    defaultValues,
  });

  const { handleSubmit, watch, setValue, getValues, reset } = methods;

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Dictionary from store language ───────────────
  const dict: Dictionary = dictionaries[storeLanguage] || dictionaries.es;

  // ── Detect external store changes ────────────────
  // When dataVersion changes, the store was updated. We compare the new store
  // data against what we last synced to determine if this is:
  //   - Our own debounced sync (deepEqual match → no reset needed)
  //   - An external mutation like import/translation (deepEqual fails → reset)
  const lastSyncedData = useRef<CVData | null>(null);

  useEffect(() => {
    if (!storeCvData || dataVersion === 0) return;

    // Short-circuit: first load, no comparison needed
    if (lastSyncedData.current === null) {
      lastSyncedData.current = storeCvData;
      reset(normalizeDates(storeCvData), { keepDefaultValues: false });
      return;
    }

    // If the store matches what we last pushed, this is our own sync — skip reset.
    if (deepEqual(lastSyncedData.current, storeCvData)) return;

    // External change detected — sync form to store.
    reset(normalizeDates(storeCvData), { keepDefaultValues: false });
    lastSyncedData.current = storeCvData;
  }, [storeCvData, dataVersion, reset]);

  // ── Form → Store sync (debounced) ────────────────
  // Debounce prevents every keystroke from hitting the store. When the debounce
  // fires, we update the store AND record what we sent so the effect above
  // knows this is our own sync (not an external change).
  const storeSyncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const subscription = watch((value) => {
      if (value) {
        setIsSaving(true);
        if (storeSyncTimeout.current) clearTimeout(storeSyncTimeout.current);
        storeSyncTimeout.current = setTimeout(() => {
          const formData = value as CVData;
          // Record what we're about to push — the effect above will see this
          // matches the store and skip the reset.
          lastSyncedData.current = formData;
          setStoreCVData(formData);
          const formLang = formData.language;
          if (formLang && formLang !== storeLanguage) {
            setStoreLanguage(formLang);
          }
          setIsSaving(false);
          setLastSaved(new Date());
        }, 300);
      }
    });
    return () => {
      subscription.unsubscribe();
      if (storeSyncTimeout.current) clearTimeout(storeSyncTimeout.current);
    };
  }, [watch, setStoreCVData, storeLanguage, setStoreLanguage]);

  // ── Handlers ─────────────────────────────────────
  // All handlers that push form data to the store must set lastSyncedData
  // BEFORE calling setStoreCVData, so the detect-effect sees this as our own
  // sync (not an external change) and skips the reset.
  const onSubmit = (data: CVData) => {
    lastSyncedData.current = data;
    setStoreCVData(data);
  };

  const handlePreview = useCallback(() => {
    const data = getValues();
    lastSyncedData.current = data;
    setStoreCVData(data);
    setShowPreview(true);
  }, [getValues, setStoreCVData]);

  const handleDownloadPDF = useCallback(async () => {
    const data = getValues();
    lastSyncedData.current = data;
    setStoreCVData(data);
    await generateCvPdf(data, dict);
  }, [getValues, setStoreCVData, dict]);

  const handleApplyCvData = (data: CVData) => {
    const normalized = replaceBulletInDescriptions(data);
    // This IS an external change (import) — do NOT set lastSyncedData.
    // The detect-effect will see the mismatch and call reset() to sync the form.
    setStoreCVData(normalized);
  };

  const handleApplyChatSuggestion = (
    _suggestion: Suggestion,
    updatedCv: CVData,
  ) => {
    // This IS an external change (AI suggestion) — do NOT set lastSyncedData.
    setStoreCVData(updatedCv);
  };

  const handleLangChange = useCallback(
    (l: "es" | "en") => {
      setValue("language", l);
      setStoreLanguage(l);
    },
    [setValue, setStoreLanguage],
  );

  return {
    // ── State ────────────────────────────────────
    mounted,
    showPreview,
    formData: storeCvData,
    lang: storeLanguage,
    jobDescription: storeJobDescription,
    activeTab,
    collapseAll,
    showChatPanel,
    generateSubTab,
    coverLetterVersion,
    isSaving,
    lastSaved,

    // ── Setters (UI-local) ───────────────────────
    setShowPreview,
    setActiveTab,
    setCollapseAll,
    setShowChatPanel,
    setGenerateSubTab,
    setCoverLetterVersion,

    // ── Store-backed setters ──────────────────────
    setLang: setStoreLanguage,
    setJobDescription: setStoreJobDescription,

    // ── Form ──────────────────────────────────────
    methods,
    handleSubmit,
    watch,
    setValue,
    getValues,

    // ── Handlers ──────────────────────────────────
    onSubmit,
    handlePreview,
    handleDownloadPDF,
    handleApplyCvData,
    handleApplyChatSuggestion,
    handleLangChange,

    // ── Dict ──────────────────────────────────────
    dict,
  };
}
