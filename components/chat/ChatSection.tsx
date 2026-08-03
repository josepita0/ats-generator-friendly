'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { CVData } from '@/types/cv';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { ChatMessage, Suggestion, SuggestionStatus, ChatResponse } from '@/types/chat';
import { suggestionLabel, applySuggestion } from '@/lib/cv/suggestions';
import { SuggestionCard } from './SuggestionCard';

interface Props {
  dict: Dictionary;
  getCvData: () => CVData;
  onApplySuggestion: (suggestion: Suggestion, updatedCv: CVData) => void;
  language: 'es' | 'en';
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  compact?: boolean;
}

export function ChatSection({ dict, getCvData, onApplySuggestion, language, jobDescription, onJobDescriptionChange, compact = false }: Props) {
  const [showJobDesc, setShowJobDesc] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [suggestionStatuses, setSuggestionStatuses] = useState<Record<string, SuggestionStatus>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || sending) return;
    const trimmed = input.trim();
    setInput('');
    setError('');

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);

    try {
      const currentCv = getCvData();
      const history = messages.map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history,
          cvData: currentCv,
          jobDescription: jobDescription || undefined,
          language,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || dict.chat.error);
      }

      const result: ChatResponse = await response.json();
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.reply,
        suggestions: result.suggestions.length > 0 ? result.suggestions : undefined,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      const newStatuses: Record<string, SuggestionStatus> = {};
      for (const s of result.suggestions) {
        newStatuses[s.id] = 'pending';
      }
      setSuggestionStatuses((prev) => ({ ...prev, ...newStatuses }));
    } catch (err) {
      setError(err instanceof Error ? err.message : dict.chat.error);
    } finally {
      setSending(false);
    }
  }, [input, sending, messages, jobDescription, language, dict, getCvData]);

  const handleApply = useCallback(
    (suggestion: Suggestion) => {
      const cv = getCvData();
      const updated = applySuggestion(cv, suggestion);
      if (updated) {
        onApplySuggestion(suggestion, updated);
        setSuggestionStatuses((prev) => ({ ...prev, [suggestion.id]: 'applied' }));
      } else {
        setSuggestionStatuses((prev) => ({ ...prev, [suggestion.id]: 'unavailable' }));
      }
    },
    [getCvData, onApplySuggestion]
  );

  const handleDismiss = useCallback((suggestionId: string) => {
    setSuggestionStatuses((prev) => ({ ...prev, [suggestionId]: 'dismissed' }));
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (compact) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowJobDesc(!showJobDesc)}
            className={`px-pill text-[10px] ${showJobDesc ? 'bg-[#2AB7C9] text-[#06132E]' : ''}`}
          >
            {dict.chat.jobDescription}
            {jobDescription ? ' ✓' : ''}
          </button>
        </div>

        {showJobDesc && (
          <div>
            <textarea
              value={jobDescription}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              placeholder={dict.chat.jobDescriptionPlaceholder}
              rows={3}
              className="px-input w-full text-xs resize-y"
              aria-label={dict.chat.jobDescription}
            />
          </div>
        )}

        {messages.length === 0 && !error && (
          <div className="flex flex-wrap gap-1.5">
            {(dict.chat.examples || []).map((example, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInput(example)}
                className="px-pill text-[10px]"
              >
                {example}
              </button>
            ))}
          </div>
        )}

        <div className="border-2 border-[#06132E] rounded-lg bg-[#071539]/50 min-h-[100px] max-h-[250px] overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className="p-2.5 border-b border-[#2AB7C9]/10 last:border-b-0">
              <div className="flex items-start gap-2">
                <span className={`text-[10px] font-label-md font-bold mt-0.5 shrink-0 ${
                  msg.role === 'user' ? 'text-[#F86B2A]' : 'text-[#FFC329]'
                }`}>
                  {msg.role === 'user' ? dict.chat.you : dict.chat.ai}
                </span>
                <p className="text-xs text-[#FFF3D5] whitespace-pre-wrap">{msg.content}</p>
              </div>

              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-2.5 space-y-2">
                  {msg.suggestions.map((sug) => (
                    <SuggestionCard
                      key={sug.id}
                      suggestion={sug}
                      label={suggestionLabel(sug.target, getCvData(), dict)}
                      status={suggestionStatuses[sug.id] || 'pending'}
                      onApply={handleApply}
                      onDismiss={handleDismiss}
                      dictApply={dict.chat.apply}
                      dictDismiss={dict.chat.dismiss}
                      dictApplied={dict.chat.applied}
                      dictDismissed={dict.chat.dismissed}
                      dictUnavailable={dict.chat.unavailable}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          {error && (
            <div className="p-2.5">
              <p className="text-xs text-red-400 font-label-md">{error}</p>
            </div>
          )}

          {sending && (
            <div className="p-2.5 flex items-center gap-2">
              <span className="text-[10px] font-label-md font-bold text-[#FFC329]">{dict.chat.ai}</span>
              <span className="text-xs text-[#FFF3D5] animate-pulse">{dict.chat.thinking}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={dict.chat.placeholder}
            rows={2}
            disabled={sending}
            className="px-input flex-1 text-xs resize-none"
            aria-label={dict.chat.placeholder}
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || !input.trim()}
            className="px-btn-orange shrink-0 text-xs py-1 px-3"
          >
            {sending ? '...' : 'ASK AI'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded bg-surface-container retro-border p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-on-surface font-headline-md font-bold text-lg flex items-center gap-2">
          <svg className="w-5 h-5 text-tertiary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a4 4 0 0 1 4 4c0 1.3-.6 2.4-1.5 3.1A9 9 0 0 1 21 17a1 1 0 0 1-2 0 7 7 0 0 0-14 0 1 1 0 0 1-2 0 9 9 0 0 1 6.5-7.9A4 4 0 0 1 8 6a4 4 0 0 1 4-2z" />
          </svg>
          {dict.chat.title}
        </h3>
        <button
          type="button"
          onClick={() => setShowJobDesc(!showJobDesc)}
          className={`text-xs px-3 py-1 rounded-full font-label-md transition-colors cursor-pointer ${
            showJobDesc
              ? 'bg-tertiary text-on-tertiary'
              : 'bg-surface-bright text-on-surface hover:bg-surface-container-high'
          } ${jobDescription ? 'ring-2 ring-tertiary/50' : ''}`}
        >
          {dict.chat.jobDescription}
          {jobDescription ? ` ✓` : ''}
        </button>
      </div>

      {showJobDesc && (
        <div className="mb-4">
          <textarea
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            placeholder={dict.chat.jobDescriptionPlaceholder}
            rows={5}
            className="retro-input w-full p-3 text-sm font-mono resize-y"
            aria-label={dict.chat.jobDescription}
          />
        </div>
      )}

      <div className="border-2 border-outline/20 rounded-lg bg-surface-dim/50 mb-3 min-h-[120px] max-h-[400px] overflow-y-auto">
        {messages.length === 0 && !error && (
          <div className="p-4 text-sm text-on-surface space-y-2">
            <p>{dict.chat.emptyHint || (language === 'es' ? 'Pega una oferta de trabajo arriba y pídeme que adapte tu CV.' : 'Paste a job description above and ask me to adapt your CV.')}</p>
            <div className="flex flex-wrap gap-2">
              {(dict.chat.examples || []).map((example, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInput(example)}
                  className="text-xs bg-surface-bright text-on-surface px-3 py-1.5 rounded-full font-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="p-3 border-b border-outline/10 last:border-b-0">
            <div className="flex items-start gap-2">
              <span className={`text-xs font-label-md font-bold mt-0.5 shrink-0 ${
                msg.role === 'user' ? 'text-primary' : 'text-tertiary'
              }`}>
                {msg.role === 'user' ? dict.chat.you : dict.chat.ai}
              </span>
              <p className="text-sm text-on-surface whitespace-pre-wrap">{msg.content}</p>
            </div>

            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="mt-3 space-y-2">
                {msg.suggestions.map((sug) => (
                  <SuggestionCard
                    key={sug.id}
                    suggestion={sug}
                    label={suggestionLabel(sug.target, getCvData(), dict)}
                    status={suggestionStatuses[sug.id] || 'pending'}
                    onApply={handleApply}
                    onDismiss={handleDismiss}
                    dictApply={dict.chat.apply}
                    dictDismiss={dict.chat.dismiss}
                    dictApplied={dict.chat.applied}
                    dictDismissed={dict.chat.dismissed}
                    dictUnavailable={dict.chat.unavailable}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {error && (
          <div className="p-3">
            <p className="text-sm text-red-500 font-label-md">{error}</p>
          </div>
        )}

        {sending && (
          <div className="p-3 flex items-center gap-2">
            <span className="text-xs font-label-md font-bold text-tertiary">{dict.chat.ai}</span>
            <span className="text-sm text-on-surface animate-pulse">{dict.chat.thinking}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={dict.chat.placeholder}
          rows={2}
          disabled={sending}
          className="retro-input flex-1 p-3 text-sm font-mono resize-none"
          aria-label={dict.chat.placeholder}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={sending || !input.trim()}
          className="shrink-0 px-4 py-2 bg-primary text-white rounded-full font-label-md font-bold hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer text-sm"
        >
          {sending ? '...' : dict.chat.send}
        </button>
      </div>
    </div>
  );
}
