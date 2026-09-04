"use client";

import type { EditorSection, SectionStatus } from "./types";

interface EditorSidebarProps {
  activeSection: EditorSection;
  sectionStatuses: SectionStatus[];
  onSectionChange: (section: EditorSection) => void;
  atsScore: number;
}

export function EditorSidebar({
  activeSection,
  sectionStatuses,
  onSectionChange,
  atsScore,
}: EditorSidebarProps) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (atsScore / 100) * circumference;

  const scoreColor =
    atsScore >= 90
      ? "text-primary"
      : atsScore >= 70
        ? "text-tertiary"
        : "text-error";

  return (
    <aside className="hidden lg:block w-[400px] sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto custom-scroll shrink-0 ">
      <div className="px-3 py-4 pt-0">
        {/* Secciones del CV */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-label-xs text-label-xs text-on-surface-variant  tracking-wider  px-3">
              Secciones del CV
            </h2>
            <span className="bg-surface-container text-primary  rounded-full w-6 h-6 flex items-center justify-center text-[0.75rem] font-semibold">
              6
            </span>
          </div>

          <nav className="space-y-2">
            {sectionStatuses.map((section) => {
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => onSectionChange(section.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`
                    w-full text-left px-3.5 py-2.5 rounded-md editor-transition hover:cursor-pointer
                    ${
                      isActive
                        ? "bg-primary text-on-primary shadow-card"
                        : "hover:bg-surface-container text-on-surface hover:shadow-card-hover"
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5 ">
                    <span
                      className={`material-symbols-outlined text-[20px] mt-0.5  ${
                        isActive
                          ? "text-on-primary bg-on-primary-fixed-variant p-2 rounded-full"
                          : "text-on-surface-variant"
                      }`}
                    >
                      {section.icon}
                    </span>

                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-center justify-between gap-2">
                        <h3
                          className={`font-title-sm text-title-sm font-semibold truncate ${
                            isActive ? "text-on-primary" : "text-on-surface"
                          }`}
                        >
                          {section.label}
                        </h3>
                      </div>

                      <p
                        className={`font-body-xs text-body-xs mt-0.5 truncate ${
                          isActive
                            ? "text-on-primary/80"
                            : "text-on-surface-variant"
                        }`}
                      >
                        {section.summary}
                      </p>
                    </div>
                    {section.isComplete && (
                      <span
                        className={`material-symbols-outlined text-[14px] ${
                          isActive ? "text-on-primary/80" : "text-success"
                        }`}
                      >
                        check_circle
                      </span>
                    )}

                    {!section.isComplete && isActive && (
                      <span
                        className={`material-symbols-outlined text-[14px] ${
                          isActive ? "text-on-primary/80" : "text-success"
                        }`}
                      >
                        arrow_forward
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ATS Health Card */}
        <div className="card p-4">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="material-symbols-outlined">data_saver_on</span>
            <h3 className="font-label-xs text-label-xs text-primary  font-semibold tracking-wider ">
              Salud del formato ATS
            </h3>
          </div>

          <div className="flex items-center justify-center mb-3">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="var(--color-surface-container)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="var(--color-primary-container)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={`font-headline-md text-headline-md font-bold ${scoreColor}`}
                >
                  {atsScore}
                </span>
                <span className="text-on-surface-variant text-[0.5rem] font-label-xs">
                  /100
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-body-xs text-body-xs">Columna única</span>
              <span className="material-symbols-outlined text-success text-[16px]">
                check
              </span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-body-xs text-body-xs">Sin imágenes</span>
              <span className="material-symbols-outlined text-success text-[16px]">
                check
              </span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-body-xs text-body-xs">
                Texto seleccionable
              </span>
              <span className="material-symbols-outlined text-success text-[16px]">
                check
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
