"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCVStore } from "@/stores/cvStore";

const NAV_ITEMS = [
  { href: "/editor", label: "Editor de CV", icon: "edit_note" },
  { href: "/preview", label: "Vista Previa ATS", icon: "visibility" },
  { href: "/job-matcher", label: "Adaptar IA", icon: "auto_awesome" },
  { href: "/settings", label: "Ajustes", icon: "settings" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function AppNavigation() {
  const pathname = usePathname();
  const hasApiKey = !!useCVStore((s) => s.apiKey);

  return (
    <>
      {/* ── Desktop header (lg+) ──────────────────────────── */}
      <header className="hidden lg:flex items-center justify-between h-16 px-[3rem] border-b border-outline-variant/30 bg-surface-container-lowest/80 backdrop-blur-sm sticky top-0 z-40">
        {/* Left: Logo + badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Avora" width={32} height={32} />
            <div className="flex flex-col items-center gap-1">
              <span className="font-title-md text-[1.125rem] font-semibold text-on-surface tracking-tight">
                Avora
              </span>
              <span className="badge badge-success">100% Local</span>
            </div>
          </Link>
        </div>

        {/* Center: Nav tabs */}
        <nav className="flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.8125rem] font-semibold transition-colors
                  ${
                    active
                      ? "bg-primary-container text-on-primary"
                      : "text-on-surface-variant hover:bg-surface-container"
                  }
                `}
              >
                <span className="material-symbols-outlined text-[1rem]">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Status badges */}
        <div className="flex items-center gap-1.5">
          {hasApiKey ? (
            <span className="badge badge-success">
              <span className="material-symbols-outlined text-[0.625rem]">
                check_circle
              </span>
              IA Configurada
            </span>
          ) : (
            <Link href="/settings" className="badge badge-warning">
              <span className="material-symbols-outlined text-[0.625rem]">
                warning
              </span>
              Configurar API Key
            </Link>
          )}
        </div>
      </header>

      {/* ── Mobile bottom nav (<lg) ──────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-sm border-t border-outline-variant/30 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-stretch">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors
                  ${active ? "text-primary" : "text-on-surface-variant"}
                `}
              >
                <span className="material-symbols-outlined text-[1.25rem]">
                  {item.icon}
                </span>
                <span className="text-[0.625rem] font-semibold leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
