import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { AppNavigation } from "@/components/navigation/AppNavigation";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-newsreader",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Avora — CV Bilingüe Optimizado para ATS | ES/EN",
    template: "%s | Avora",
  },
  description:
    "Construí tu CV bilingüe optimizado para sistemas ATS. Asistente de IA, exportación PDF del lado del cliente. Gratis, sin registro.",
  metadataBase: new URL("https://avora.app"),
  alternates: {
    canonical: "/",
    languages: {
      es: "/?lang=es",
      en: "/?lang=en",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "Avora",
    title: "Avora — CV Bilingüe Optimizado para ATS",
    description:
      "Construí tu CV bilingüe optimizado para sistemas ATS. Asistente de IA, exportación PDF. Gratis, sin registro.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Avora — CV Bilingüe Optimizado para ATS",
    description:
      "Construí tu CV bilingüe optimizado para sistemas ATS. Asistente de IA, exportación PDF. Gratis, sin registro.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  manifest: "/manifest.json",
  applicationName: "Avora",
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${newsreader.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col text-on-background font-body-md">
        <AppNavigation />
        <main className="flex-1">{children}</main>
        <footer className="hidden lg:block border-t border-outline-variant/30 py-4 px-[3rem]">
          <p className="text-center text-on-surface-variant text-sm">
            Avora Editorial Suite &bull; Privacidad total en el navegador
          </p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
