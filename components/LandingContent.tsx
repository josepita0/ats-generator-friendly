"use client";

import { useState } from "react";
import Link from "next/link";
import { es, en, Dictionary } from "@/lib/i18n/dictionaries";

type Lang = "es" | "en";
const dict = { es, en };

export function LandingContent() {
  const [lang, setLang] = useState<Lang>("es");
  const t: Dictionary = dict[lang];

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Language toggle */}
      <div className="absolute top-5 right-5 z-20">
        <button
          onClick={() => setLang(lang === "es" ? "en" : "es")}
          className="btn-ghost flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface"
          aria-label={lang === "es" ? "Switch to English" : "Cambiar a español"}
        >
          <span className="material-symbols-outlined text-[1rem]">
            translate
          </span>
          {lang === "es" ? "EN" : "ES"}
        </button>
      </div>

      {/* ── Hero Section ───────────────────────────────────── */}
      <section className="relative px-[1.25rem] sm:px-[2rem] lg:px-[3rem] pt-20 sm:pt-28 lg:pt-36 pb-16 sm:pb-24">
        {/* Botanical glow — soft radial gradient behind hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] glow-primary rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-[960px] mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8">
            <span className="badge badge-success">
              <span className="material-symbols-outlined text-[0.75rem]">
                check_circle
              </span>
              100% Client-Side &bull; Zero Servers
            </span>
          </div>

          {/* Headline — Newsreader serif, large and confident */}
          <h1 className="font-headline-xl text-[2.75rem] sm:text-[3.5rem] lg:text-[4.25rem] font-semibold text-on-surface leading-[1.05] tracking-tight mb-6">
            {t.landing.title.split(" ").slice(0, 3).join(" ")}{" "}
            <br className="hidden sm:block" />
            <span className="text-primary">
              {t.landing.title.split(" ").slice(3).join(" ")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-body-lg text-lg sm:text-xl text-on-surface-variant max-w-[540px] mx-auto mb-10 leading-relaxed">
            {t.landing.subtitle}
          </p>

          {/* CTA group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/editor"
              className="btn-primary inline-flex items-center gap-2 text-base font-semibold"
            >
              {t.landing.cta}
              <span className="material-symbols-outlined text-[1.125rem]">
                arrow_forward
              </span>
            </Link>
            <Link
              href="/preview"
              className="btn-secondary inline-flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-[1rem]">
                visibility
              </span>
              {t.landing.importPdfAction}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features Section ───────────────────────────────── */}
      <section className="px-[1.25rem] sm:px-[2rem] lg:px-[3rem] pb-16 sm:pb-24">
        <div className="max-w-[960px] mx-auto">
          <p className="section-label text-center mb-10">
            {lang === "es" ? "Características" : "Features"}
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 — ATS Compliant */}
            <div className="card-hover flex flex-col gap-4 p-8">
              <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[1.5rem]">
                  document_scanner
                </span>
              </div>
              <h3 className="font-headline-lg text-lg font-semibold text-on-surface">
                {t.landing.features.atsCompliant}
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                {t.landing.features.atsDesc}
              </p>
            </div>

            {/* Feature 2 — Bilingual */}
            <div className="card-hover flex flex-col gap-4 p-8">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[1.5rem]">
                  translate
                </span>
              </div>
              <h3 className="font-headline-lg text-lg font-semibold text-on-surface">
                {t.landing.features.bilingual}
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                {t.landing.features.bilingualDesc}
              </p>
            </div>

            {/* Feature 3 — AI Assistant */}
            <div className="card-hover flex flex-col gap-4 p-8">
              <div className="w-12 h-12 rounded-2xl bg-tertiary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-tertiary-container text-[1.5rem]">
                  auto_awesome
                </span>
              </div>
              <h3 className="font-headline-lg text-lg font-semibold text-on-surface">
                {t.landing.features.aiAssistant}
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                {t.landing.features.aiDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Visual CV Example Section ──────────────────────── */}
      <section className="px-[1.25rem] sm:px-[2rem] lg:px-[3rem] pb-20 sm:pb-32">
        <div className="max-w-[960px] mx-auto">
          <p className="section-label text-center mb-10">
            {lang === "es" ? "Así se ve tu CV" : "What your CV looks like"}
          </p>

          {/* Mock CV card — demonstrates the ATS-friendly format */}
          <div className="bg-surface-container-lowest rounded-3xl border-hairline shadow-card overflow-hidden max-w-[640px] mx-auto">
            {/* CV Header */}
            <div className="px-8 pt-8 pb-6 border-b border-outline-variant/30">
              <h2 className="font-headline-xl text-2xl sm:text-3xl font-semibold text-on-surface tracking-tight mb-1">
                Ana Sofía Martínez
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant">
                Senior Product Designer &bull; Buenos Aires, AR
              </p>
              <p className="font-body-sm text-xs text-on-surface-variant mt-1">
                ana.martinez@email.com &bull; +54 11 4567-8910 &bull;
                linkedin.com/in/anamartinez
              </p>
            </div>

            {/* CV Summary */}
            <div className="px-8 py-6 border-b border-outline-variant/30">
              <h3 className="section-label text-primary mb-3">Summary</h3>
              <p className="font-body-md text-sm text-on-surface leading-relaxed">
                Product designer with 8+ years of experience leading design
                systems and user research for B2B SaaS platforms. Reduced churn
                23% through data-driven UX improvements. Bilingual in Spanish
                and English with international remote collaboration experience.
              </p>
            </div>

            {/* CV Experience */}
            <div className="px-8 py-6 border-b border-outline-variant/30">
              <h3 className="section-label text-primary mb-4">Experience</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <h4 className="font-title-md text-sm font-semibold text-on-surface">
                      Lead Product Designer
                    </h4>
                    <span className="font-body-sm text-xs text-on-surface-variant whitespace-nowrap">
                      03/2021 &ndash; Present
                    </span>
                  </div>
                  <p className="font-body-sm text-xs text-on-surface-variant mb-2">
                    TechCo &bull; Remote
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    <li className="font-body-sm text-xs text-on-surface leading-relaxed flex gap-2">
                      <span className="text-primary mt-0.5 shrink-0">
                        &bull;
                      </span>
                      Led redesign of core SaaS dashboard serving 12K+
                      enterprise users, improving task completion rate by 34%
                    </li>
                    <li className="font-body-sm text-xs text-on-surface leading-relaxed flex gap-2">
                      <span className="text-primary mt-0.5 shrink-0">
                        &bull;
                      </span>
                      Established and maintained a design system with 60+
                      components used across 4 product teams
                    </li>
                    <li className="font-body-sm text-xs text-on-surface leading-relaxed flex gap-2">
                      <span className="text-primary mt-0.5 shrink-0">
                        &bull;
                      </span>
                      Conducted quarterly user research with 40+ participants,
                      translating insights into roadmap priorities
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CV Skills */}
            <div className="px-8 py-6">
              <h3 className="section-label text-primary mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Figma",
                  "Design Systems",
                  "User Research",
                  "Prototyping",
                  "React",
                  "TypeScript",
                  "WCAG 2.1",
                  "SQL",
                ].map((skill) => (
                  <span key={skill} className="chip chip-inactive">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Annotation — why ATS-friendly */}
          <div className="mt-8 flex items-center justify-center gap-3 text-center">
            <span className="material-symbols-outlined text-primary text-[1.25rem]">
              info
            </span>
            <p className="font-body-sm text-sm text-on-surface-variant max-w-md">
              {lang === "es"
                ? "Formato single-column, texto seleccionable, sin tablas ni gráficos — ideal para sistemas ATS."
                : "Single-column format, selectable text, no tables or charts — ideal for ATS systems."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
