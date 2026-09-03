import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pdf } from "@react-pdf/renderer";
import { CVData } from "@/types/cv";
import { Suggestion } from "@/types/chat";
import { cvDataSchema } from "@/lib/cv/schemas";
import { createEmptyCVData } from "@/lib/cv/defaults";
import { replaceBulletInDescriptions } from "@/lib/cv/descriptions";
import { normalizeDates } from "@/lib/cv/normalize";
import { loadCVData, saveCVData } from "@/lib/storage";
import { downloadPdf } from "@/lib/pdf";
import { es, en, Dictionary } from "@/lib/i18n/dictionaries";
import { CVDocument } from "@/components/pdf";

export type MobileTab = "editor" | "generate";

const dictionaries = { es, en };

export function useCVForm() {
  const [mounted, setMounted] = useState(false);
  const [initialData, setInitialData] = useState<CVData>(() =>
    createEmptyCVData(),
  );
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<CVData | null>(null);
  const [lang, setLang] = useState<"es" | "en">("es");
  const [jobDescription, setJobDescription] = useState("");
  const [activeTab, setActiveTab] = useState<MobileTab>("editor");
  const [collapseAll, setCollapseAll] = useState<boolean | null>(null);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [generateSubTab, setGenerateSubTab] = useState<"pdf" | "cover-letter">(
    "pdf",
  );
  const [coverLetterVersion, setCoverLetterVersion] = useState(0);

  const methods = useForm<CVData>({
    resolver: zodResolver(cvDataSchema),
    values: initialData,
  });

  const { handleSubmit, watch, setValue, getValues } = methods;

  useEffect(() => {
    setMounted(true);
    const stored = loadCVData();
    if (stored) {
      const normalized = normalizeDates(stored);
      setInitialData(normalized);
    }
  }, []);

  const currentLang = watch("language");
  useEffect(() => {
    if (currentLang) setLang(currentLang);
  }, [currentLang]);

  const dict: Dictionary = dictionaries[lang] || dictionaries.es;

  const onSubmit = (data: CVData) => {
    saveCVData(data);
    setFormData(data);
  };

  const handlePreview = useCallback(() => {
    const data = getValues();
    saveCVData(data);
    setFormData(data);
    setShowPreview(true);
  }, [getValues]);

  const handleDownloadPDF = useCallback(async () => {
    const data = getValues();
    saveCVData(data);
    setFormData(data);
    const blob = await pdf(<CVDocument data={data} dict={dict} />).toBlob();
    downloadPdf(
      blob,
      `${data.personalInfo.name.replace(/\s+/g, "_")}_CV.pdf`,
    );
  }, [getValues, dict]);

  useEffect(() => {
    if (!mounted) return;
    const subscription = watch((data) => {
      if (data) saveCVData(data as CVData);
    });
    return () => subscription.unsubscribe();
  }, [watch, mounted]);

  const handleApplyCvData = (data: CVData) => {
    const normalized = replaceBulletInDescriptions(data);
    Object.entries(normalized).forEach(([key, value]) => {
      setValue(key as keyof CVData, value);
    });
  };

  const handleApplyChatSuggestion = (
    _suggestion: Suggestion,
    updatedCv: CVData,
  ) => {
    Object.entries(updatedCv).forEach(([key, value]) => {
      setValue(key as keyof CVData, value);
    });
    saveCVData(updatedCv);
  };

  const handleLangChange = useCallback(
    (l: "es" | "en") => {
      setValue("language", l);
    },
    [setValue],
  );

  return {
    // State
    mounted,
    showPreview,
    formData,
    lang,
    jobDescription,
    activeTab,
    collapseAll,
    showChatPanel,
    generateSubTab,
    coverLetterVersion,

    // Setters
    setShowPreview,
    setLang,
    setJobDescription,
    setActiveTab,
    setCollapseAll,
    setShowChatPanel,
    setGenerateSubTab,
    setCoverLetterVersion,

    // Form
    methods,
    handleSubmit,
    watch,
    setValue,
    getValues,

    // Handlers
    onSubmit,
    handlePreview,
    handleDownloadPDF,
    handleApplyCvData,
    handleApplyChatSuggestion,
    handleLangChange,

    // Dict
    dict,
  };
}
