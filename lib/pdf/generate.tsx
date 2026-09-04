/**
 * Lazy PDF generation utilities.
 *
 * Dynamically imports @react-pdf/renderer and the corresponding document
 * component only when a download is triggered. This keeps the ~150KB+
 * library out of the main bundle.
 */
import type { CVData } from '@/types/cv';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { downloadPdf } from '@/lib/pdf';

/**
 * Generates and downloads a CV PDF.
 * Lazily imports @react-pdf/renderer and CVDocument on first call.
 */
export async function generateCvPdf(data: CVData, dict: Dictionary): Promise<void> {
  const [{ pdf }, { CVDocument }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('@/components/pdf/CVDocument'),
  ]);

  const blob = await pdf(<CVDocument data={data} dict={dict} />).toBlob();
  downloadPdf(blob, `${data.personalInfo.name.replace(/\s+/g, '_')}_CV.pdf`);
}

/**
 * Generates and downloads a Cover Letter PDF.
 * Lazily imports @react-pdf/renderer and CoverLetterDocument on first call.
 */
export async function generateCoverLetterPdf(
  personalInfo: CVData['personalInfo'],
  body: string,
  language: 'es' | 'en',
  dict: Dictionary,
): Promise<void> {
  const [{ pdf }, { CoverLetterDocument }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('@/components/pdf/CoverLetterDocument'),
  ]);

  const blob = await pdf(
    <CoverLetterDocument
      personalInfo={personalInfo}
      body={body}
      language={language}
      dict={dict}
    />,
  ).toBlob();
  downloadPdf(blob, `${personalInfo.name.replace(/\s+/g, '_')}_Cover_Letter.pdf`);
}
