'use client';

import type { Suggestion, SuggestionStatus } from '@/types/chat';

interface Props {
  suggestion: Suggestion;
  label: string;
  status: SuggestionStatus;
  onApply: (suggestion: Suggestion) => void;
  onDismiss: (id: string) => void;
  dictApply: string;
  dictDismiss: string;
  dictApplied: string;
  dictDismissed: string;
  dictUnavailable: string;
}

export function SuggestionCard({
  suggestion,
  label,
  status,
  onApply,
  onDismiss,
  dictApply,
  dictDismiss,
  dictApplied,
  dictDismissed,
  dictUnavailable,
}: Props) {
  let statusBadge: string | null = null;
  if (status === 'applied') statusBadge = dictApplied;
  if (status === 'dismissed') statusBadge = dictDismissed;
  if (status === 'unavailable') statusBadge = dictUnavailable;

  return (
    <div className="border-2 border-black rounded-lg overflow-hidden bg-white">
      <div className="bg-surface-variant px-3 py-2 border-b border-outline/30">
        <span className="text-xs text-on-surface font-label-md font-bold">{label}</span>
        {statusBadge && (
          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-label-md ${
            status === 'applied' ? 'bg-green-200 text-green-800' :
            status === 'dismissed' ? 'bg-gray-200 text-gray-600' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {statusBadge}
          </span>
        )}
      </div>

      <div className="px-3 py-2 space-y-2">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-label-md">
            {label.includes('(ES)') ? 'Actual' : label.includes('(EN)') ? 'Current' : ''}
          </span>
          <p className="text-sm text-black line-through opacity-60 font-mono bg-red-50/50 rounded p-2 border border-red-200">
            {suggestion.current}
          </p>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-label-md">
            {label.includes('(ES)') ? 'Propuesta' : label.includes('(EN)') ? 'Proposed' : ''}
          </span>
          <p className="text-sm text-black bg-green-50/50 rounded p-2 border border-green-200 font-mono">
            {suggestion.proposed}
          </p>
        </div>

        {suggestion.rationale && (
          <p className="text-xs text-gray-600 italic">
            {suggestion.rationale}
          </p>
        )}
      </div>

      {status === 'pending' && (
        <div className="px-3 py-2 border-t border-outline/20 flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => onDismiss(suggestion.id)}
            className="px-3 py-1 text-xs text-gray-600 bg-surface-variant/30 rounded-full font-label-md hover:bg-surface-variant/50 transition-colors cursor-pointer"
          >
            {dictDismiss}
          </button>
          <button
            type="button"
            onClick={() => onApply(suggestion)}
            className="px-3 py-1 text-xs text-white bg-primary rounded-full font-label-md font-bold hover:opacity-90 transition-opacity cursor-pointer"
          >
            {dictApply}
          </button>
        </div>
      )}
    </div>
  );
}
