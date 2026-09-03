import { CVData } from "@/types/cv";

/**
 * Normalizes date fields in experience and education entries.
 * Ensures endDate is always populated, and startDate is cleared
 * when it would be redundant (no endDate set).
 */
export function normalizeDates(data: CVData): CVData {
  return {
    ...data,
    experience: data.experience.map((exp) => ({
      ...exp,
      endDate: exp.endDate || exp.startDate || "",
      startDate: exp.startDate && !exp.endDate ? "" : exp.startDate || "",
    })),
    education: data.education.map((edu) => ({
      ...edu,
      endDate: edu.endDate || edu.startDate || "",
      startDate: edu.startDate && !edu.endDate ? "" : edu.startDate || "",
    })),
  };
}
