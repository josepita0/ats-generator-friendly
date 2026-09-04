"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface SectionDef {
  id: string;
  icon: string;
  label: string;
  subtitle: string;
}

const SECTIONS: SectionDef[] = [
  { id: "personal-info", icon: "badge", label: "Datos Personales", subtitle: "Contacto y ubicación" },
  { id: "summary", icon: "edit_note", label: "Resumen Profesional", subtitle: "Bilingüe ES/EN" },
  { id: "experience", icon: "work", label: "Experiencia Laboral", subtitle: "Trayectoria profesional" },
  { id: "education", icon: "school", label: "Educación", subtitle: "Formación académica" },
  { id: "skills", icon: "code_blocks", label: "Habilidades Técnicas", subtitle: "Categorías y skills" },
  { id: "languages", icon: "translate", label: "Idiomas", subtitle: "Niveles de dominio" },
];

interface Props {
  onNavigate?: (sectionId: string) => void;
}

export function SectionNavigator({ onNavigate }: Props) {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        setActiveId(entry.target.id);
      }
    }
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    });

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [handleIntersect]);

  const handleClick = (id: string) => {
    setActiveId(id);
    onNavigate?.(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="card">
      <p className="section-label mb-3">Secciones del CV</p>
      <div className="space-y-1">
        {SECTIONS.map((s) => {
          const active = activeId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handleClick(s.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition-colors ${
                active
                  ? "bg-primary-container text-on-primary"
                  : "text-on-surface hover:bg-surface-container"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[18px] shrink-0 ${
                  active ? "text-on-primary" : "text-on-surface-variant"
                }`}
              >
                {s.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[0.8125rem] font-title-sm font-semibold leading-tight truncate ${
                    active ? "text-on-primary" : "text-on-surface"
                  }`}
                >
                  {s.label}
                </p>
                <p
                  className={`text-[0.625rem] font-label-xs leading-tight truncate ${
                    active ? "text-on-primary/70" : "text-on-surface-variant"
                  }`}
                >
                  {s.subtitle}
                </p>
              </div>
              <span
                className={`material-symbols-outlined text-[16px] shrink-0 ${
                  active ? "text-on-primary" : "text-on-surface-variant"
                }`}
              >
                {active ? "check_circle" : "radio_button_unchecked"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
