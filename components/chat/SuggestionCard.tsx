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
    <div className="border-2 border-[#06132E] rounded-lg overflow-hidden bg-[#FFF3D5]">
      <div className="bg-[#0E4A57] px-3 py-1.5 border-b border-[#06132E] flex items-center">
        <span className="text-xs text-[#FFF3D5] font-label-md font-bold">{label}</span>
        {statusBadge && (
          <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full font-label-md ${
            status === 'applied' ? 'bg-[#2AB7C9]/40 text-[#2AB7C9] border border-[#2AB7C9]/60' :
            status === 'dismissed' ? 'bg-gray-200 text-gray-600' :
            'bg-[#FFC329]/30 text-[#FFC329] border border-[#FFC329]/60'
          }`}>
            {statusBadge}
          </span>
        )}
      </div>

      <div className="px-3 py-2 space-y-2">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#06132E]/60 font-label-md">
            {label.includes('(ES)') ? 'Actual' : label.includes('(EN)') ? 'Current' : ''}
          </span>
          <p className="text-sm text-[#06132E] line-through opacity-60 font-mono bg-red-50/50 rounded p-2 border border-red-200">
            {suggestion.current}
          </p>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#06132E]/60 font-label-md">
            {label.includes('(ES)') ? 'Propuesta' : label.includes('(EN)') ? 'Proposed' : ''}
          </span>
          <p className="text-sm text-[#06132E] bg-green-50/50 rounded p-2 border border-green-200 font-mono">
            {suggestion.proposed}
          </p>
        </div>

        {suggestion.rationale && (
          <p className="text-xs text-[#06132E]/70 italic">
            {suggestion.rationale}
          </p>
        )}
      </div>

      {status === 'pending' && (
        <div className="px-3 py-2 border-t border-[#06132E]/20 flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => onDismiss(suggestion.id)}
            className="px-3 py-1 text-xs border border-[#06132E]/40 rounded-full font-label-md hover:bg-[#06132E]/10 transition-colors cursor-pointer"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#06132E' }}
          >
            {dictDismiss}
          </button>
          <button
            type="button"
            onClick={() => onApply(suggestion)}
            className="px-btn-add text-xs"
          >
            {dictApply}
          </button>
        </div>
      )}
    </div>
  );
}
