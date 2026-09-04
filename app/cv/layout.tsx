import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CV Builder',
  description:
    'Build your ATS-friendly resume. Fill in your details, preview in real-time, and export as a clean PDF. Supports Spanish and English.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CVLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
