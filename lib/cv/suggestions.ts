import type { CVData } from '@/types/cv';
import type { Suggestion, SuggestionTarget } from '@/types/chat';
import type { Dictionary } from '@/lib/i18n/dictionaries';

export function applySuggestion(cv: CVData, suggestion: Suggestion): CVData | null {
  const result = structuredClone(cv);
  const { target, proposed } = suggestion;

  switch (target.kind) {
    case 'summary': {
      result.summary[target.lang] = proposed;
      return result;
    }
    case 'experience': {
      const exp = result.experience.find((e) => e.id === target.entryId);
      if (!exp) return null;
      if (target.field === 'position') {
        exp.position[target.lang] = proposed;
      } else {
        exp.descriptions[target.lang] = proposed;
      }
      return result;
    }
    case 'education': {
      const edu = result.education.find((e) => e.id === target.entryId);
      if (!edu) return null;
      if (target.field === 'degree') {
        edu.degree[target.lang] = proposed;
      } else {
        edu.field[target.lang] = proposed;
      }
      return result;
    }
  }
}

export function suggestionLabel(target: SuggestionTarget, cv: CVData, dict: Dictionary): string {
  switch (target.kind) {
    case 'summary':
      return dict.chat.fieldLabels.summary(target.lang);
    case 'experience': {
      const exp = cv.experience.find((e) => e.id === target.entryId);
      const company = exp?.company || target.entryId;
      const field = dict.chat.fieldLabels[target.field];
      return `${dict.chat.fieldLabels.experience} — ${company} — ${field} (${target.lang.toUpperCase()})`;
    }
    case 'education': {
      const edu = cv.education.find((e) => e.id === target.entryId);
      const institution = edu?.institution || target.entryId;
      const field = dict.chat.fieldLabels[target.field];
      return `${dict.chat.fieldLabels.education} — ${institution} — ${field} (${target.lang.toUpperCase()})`;
    }
  }
}

export function verifyEntryExists(cv: CVData, target: SuggestionTarget): boolean {
  switch (target.kind) {
    case 'summary':
      return true;
    case 'experience':
      return cv.experience.some((e) => e.id === target.entryId);
    case 'education':
      return cv.education.some((e) => e.id === target.entryId);
  }
}

export function getCurrentValue(cv: CVData, target: SuggestionTarget): string | null {
  switch (target.kind) {
    case 'summary':
      return cv.summary[target.lang];
    case 'experience': {
      const exp = cv.experience.find((e) => e.id === target.entryId);
      if (!exp) return null;
      return target.field === 'position' ? exp.position[target.lang] : exp.descriptions[target.lang];
    }
    case 'education': {
      const edu = cv.education.find((e) => e.id === target.entryId);
      if (!edu) return null;
      return target.field === 'degree' ? edu.degree[target.lang] : edu.field[target.lang];
    }
  }
}
