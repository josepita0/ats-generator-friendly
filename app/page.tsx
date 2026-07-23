'use client';

import { useState } from 'react';
import Link from 'next/link';
import { es, en, Dictionary } from '@/lib/i18n/dictionaries';

type Lang = 'es' | 'en';
const dict = { es, en };

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('es');
  const t: Dictionary = dict[lang];

  return (
    <div className="bg-pattern min-h-screen relative overflow-x-hidden">
      <div className="relative flex h-auto w-full flex-col">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 md:px-10 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1 w-full bg-surface-container rounded-retro retro-border px-4 py-2">
              <header className="flex items-center justify-between whitespace-nowrap px-4 md:px-10 py-3">
                <div className="flex items-center gap-4 text-on-surface">
                  <div className="size-6 text-primary">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path clip-rule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fill-rule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-on-surface text-lg font-bold leading-tight tracking-[-0.015em] font-headline-md">
                    RETRORESUME
                  </h2>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
                    className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-surface-variant text-on-surface gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 retro-border hover:bg-surface-bright"
                  >
                    <span className="text-sm font-label-md">{lang === 'es' ? 'ES' : 'EN'}</span>
                  </button>
                </div>
              </header>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col gap-16 relative z-10">
        <div className="absolute top-20 left-10 text-tertiary-fixed opacity-50 select-none pointer-events-none transform -rotate-12">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 48 48">
            <path d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" />
          </svg>
        </div>
        <div className="absolute top-40 right-20 text-secondary-fixed opacity-50 select-none pointer-events-none transform rotate-45">
          <span className="text-5xl">✦</span>
        </div>

        <section className="flex flex-col md:flex-row items-center gap-12 bg-surface-container-high rounded-retro retro-border p-12 relative overflow-hidden">
          <div className="w-full md:w-1/2 flex flex-col gap-6 text-left relative z-10">
            <h1
              className="text-on-surface font-headline-lg text-5xl md:text-7xl font-black leading-[1.1] tracking-tight uppercase"
              style={{ WebkitTextStroke: '1px black', textShadow: 'black 4px 4px 0px' }}
            >
              {t.landing.title} <br />
              <span className="text-primary">{t.nav.cvBuilder}</span>
            </h1>
            <p className="text-on-surface-variant text-body-lg text-xl max-w-md font-medium">
              {t.landing.subtitle}
            </p>
            <Link
              href="/cv"
              className="self-start mt-4 px-8 py-4 bg-secondary text-on-secondary-fixed font-headline-md font-bold text-xl rounded-full retro-border hover:bg-secondary-fixed-dim transition-colors uppercase tracking-wider flex items-center gap-3"
            >
              {t.landing.cta}
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
              </svg>
            </Link>
          </div>
        </section>

        <section className="flex flex-col gap-8 pb-32">
          <h2
            className="text-on-surface font-headline-md text-3xl font-bold uppercase tracking-wider pl-4"
            style={{ textShadow: 'black 2px 2px 0px' }}
          >
            {lang === 'es' ? 'Características' : 'Features'}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: t.landing.features.atsCompliant,
                desc: t.landing.features.atsDesc,
                color: 'bg-[#d8b4e2]',
              },
              {
                title: t.landing.features.bilingual,
                desc: t.landing.features.bilingualDesc,
                color: 'bg-[#92e5c8]',
              },
              {
                title: t.landing.features.aiAssistant,
                desc: t.landing.features.aiDesc,
                color: 'bg-[#fca851]',
              },
            ].map((f) => (
              <div
                key={f.title}
                className={`retro-card ${f.color} p-6 text-black`}
              >
                <h3 className="font-headline-md text-xl font-bold uppercase tracking-wide mb-2">
                  {f.title}
                </h3>
                <p className="text-sm font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-black bg-surface-container py-8">
        <p className="text-center text-on-surface-variant font-label-md text-sm">
          RETRORESUME — {t.appName}
        </p>
      </footer>
    </div>
  );
}
