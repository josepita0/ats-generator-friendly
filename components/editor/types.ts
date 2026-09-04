export type EditorSection =
  | 'personal-info'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages';

export interface SectionStatus {
  id: EditorSection;
  label: string;
  icon: string;
  summary: string;
  isComplete: boolean;
  itemCount?: number;
}

export interface EditorState {
  activeSection: EditorSection;
  setActiveSection: (section: EditorSection) => void;
  sectionStatuses: SectionStatus[];
}
