import type { Language } from './cv';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  suggestions?: Suggestion[];
  timestamp: number;
}

export type SuggestionTarget =
  | { kind: 'summary'; lang: Language }
  | { kind: 'experience'; entryId: string; field: 'position' | 'descriptions'; lang: Language }
  | { kind: 'education'; entryId: string; field: 'degree' | 'field'; lang: Language };

export interface Suggestion {
  id: string;
  target: SuggestionTarget;
  current: string;
  proposed: string;
  rationale: string;
}

export type SuggestionStatus = 'pending' | 'applied' | 'dismissed' | 'unavailable';

export interface ChatRequest {
  message: string;
  history: { role: ChatRole; content: string }[];
  cvData: unknown;
  jobDescription?: string;
  language: Language;
}

export interface ChatResponse {
  reply: string;
  suggestions: Suggestion[];
}
