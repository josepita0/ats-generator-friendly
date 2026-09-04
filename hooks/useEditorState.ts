import { useState, useMemo } from 'react';
import type { CVData } from '@/types/cv';
import type { EditorSection, SectionStatus } from '@/components/editor/types';
import { es, en } from '@/lib/i18n/dictionaries';

export function useEditorState(cvData: CVData | null, lang: 'es' | 'en') {
  const [activeSection, setActiveSection] = useState<EditorSection>('personal-info');

  const sectionStatuses = useMemo<SectionStatus[]>(() => {
    const dict = lang === 'es' ? es : en;

    // When no CV data exists yet, show sections with empty/default values
    if (!cvData) {
      return [
        {
          id: 'personal-info',
          label: dict.form.personalInfo,
          icon: 'person',
          summary: 'Completar datos básicos',
          isComplete: false,
        },
        {
          id: 'summary',
          label: dict.form.summary,
          icon: 'description',
          summary: 'Sin resumen',
          isComplete: false,
        },
        {
          id: 'experience',
          label: dict.form.experience,
          icon: 'work',
          summary: 'Sin experiencia',
          isComplete: false,
          itemCount: 0,
        },
        {
          id: 'education',
          label: dict.form.education,
          icon: 'school',
          summary: 'Sin educación',
          isComplete: false,
          itemCount: 0,
        },
        {
          id: 'skills',
          label: dict.form.skills,
          icon: 'code',
          summary: 'Sin habilidades',
          isComplete: false,
        },
        {
          id: 'languages',
          label: dict.form.languages,
          icon: 'language',
          summary: 'Sin idiomas',
          isComplete: false,
          itemCount: 0,
        },
      ];
    }

    return [
      {
        id: 'personal-info',
        label: dict.form.personalInfo,
        icon: 'person',
        summary: cvData.personalInfo.name
          ? cvData.personalInfo.location || 'Sin ubicación'
          : 'Completar datos básicos',
        isComplete: !!(cvData.personalInfo.name && cvData.personalInfo.email),
      },
      {
        id: 'summary',
        label: dict.form.summary,
        icon: 'description',
        summary: cvData.summary[lang]
          ? `${cvData.summary[lang].substring(0, 40)}...`
          : 'Sin resumen',
        isComplete: !!cvData.summary[lang],
      },
      {
        id: 'experience',
        label: dict.form.experience,
        icon: 'work',
        summary: cvData.experience.length > 0
          ? `${cvData.experience.length} ${cvData.experience.length === 1 ? 'puesto' : 'puestos'}`
          : 'Sin experiencia',
        isComplete: cvData.experience.length > 0,
        itemCount: cvData.experience.length,
      },
      {
        id: 'education',
        label: dict.form.education,
        icon: 'school',
        summary: cvData.education.length > 0
          ? cvData.education[0].degree[lang] || cvData.education[0].institution
          : 'Sin educación',
        isComplete: cvData.education.length > 0,
        itemCount: cvData.education.length,
      },
      {
        id: 'skills',
        label: dict.form.skills,
        icon: 'code',
        summary: cvData.skills.length > 0
          ? cvData.skills.map(s => s.category).join(', ').substring(0, 30)
          : 'Sin habilidades',
        isComplete: cvData.skills.length > 0,
      },
      {
        id: 'languages',
        label: dict.form.languages,
        icon: 'language',
        summary: cvData.languages.length > 0
          ? cvData.languages.map(l => l.language).join(', ')
          : 'Sin idiomas',
        isComplete: cvData.languages.length > 0,
        itemCount: cvData.languages.length,
      },
    ];
  }, [cvData, lang]);

  return {
    activeSection,
    setActiveSection,
    sectionStatuses,
  };
}
