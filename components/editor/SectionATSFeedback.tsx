"use client";

import type { SectionATSScore } from "@/lib/cv/sectionATSScore";

interface SectionATSFeedbackProps {
  score: SectionATSScore;
}

export function SectionATSFeedback({ score }: SectionATSFeedbackProps) {
  if (score.checks.length === 0 && score.recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 space-y-4">
      {/* ATS Checks */}
      {score.checks.length > 0 && (
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm">
          <h3 className="font-label-xs text-label-xs text-on-surface-variant  tracking-wider mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[16px]">
              checklist
            </span>
            Verificación ATS
          </h3>

          <div className="space-y-2.5">
            {score.checks.map((check, index) => (
              <div key={index} className="flex items-start gap-2.5">
                <span
                  className={`material-symbols-outlined text-[18px] mt-0.5 transition-colors ${
                    check.passed ? "text-success" : "text-on-surface-variant/40"
                  }`}
                >
                  {check.passed ? "check_circle" : "radio_button_unchecked"}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-body-sm text-body-sm leading-relaxed ${
                      check.passed
                        ? "text-on-surface"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {check.label}
                  </p>
                  {check.message && !check.passed && (
                    <p className="font-label-xs text-label-xs text-on-surface-variant/70 mt-0.5">
                      {check.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {score.recommendations.length > 0 && (
        <div className="rounded-2xl border border-primary-container/30 bg-primary-container/5 p-5">
          <h3 className="font-label-xs text-label-xs text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">
              auto_awesome
            </span>
            Recomendaciones
          </h3>

          <div className="space-y-3">
            {score.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-2.5">
                <span
                  className={`material-symbols-outlined text-[16px] mt-0.5 ${
                    rec.type === "warning"
                      ? "text-warning"
                      : rec.type === "success"
                        ? "text-success"
                        : "text-primary"
                  }`}
                >
                  {rec.type === "warning"
                    ? "warning"
                    : rec.type === "success"
                      ? "check_circle"
                      : "lightbulb"}
                </span>
                <p className="flex-1 font-body-sm text-body-sm text-on-surface leading-relaxed">
                  {rec.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
