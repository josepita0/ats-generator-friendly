"use client";

import { UseFormReturn } from "react-hook-form";
import { CVData } from "@/types/cv";
import { Suggestion } from "@/types/chat";
import { Dictionary } from "@/lib/i18n/dictionaries";
import { ChatSection } from "@/components/chat";

interface Props {
  dict: Dictionary;
  showChatPanel: boolean;
  setShowChatPanel: React.Dispatch<React.SetStateAction<boolean>>;
  getValues: UseFormReturn<CVData>["getValues"];
  handleApplyChatSuggestion: (
    suggestion: Suggestion,
    updatedCv: CVData,
  ) => void;
  lang: "es" | "en";
  jobDescription: string;
  setJobDescription: React.Dispatch<React.SetStateAction<string>>;
}

export function MobileChatPanel({
  dict,
  showChatPanel,
  setShowChatPanel,
  getValues,
  handleApplyChatSuggestion,
  lang,
  jobDescription,
  setJobDescription,
}: Props) {
  return (
    <>
      {/* Floating AI button - mobile only */}
      <button
        type="button"
        onClick={() => setShowChatPanel(true)}
        className="floating-ai-btn flex lg:hidden"
        aria-label="Open AI Assistant"
      >
        <svg
          className="w-6 h-6 text-[#FFC329]"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 110 2h-1v1a7 7 0 01-7 7H9a7 7 0 01-7-7v-1H1a1 1 0 110-2h1v-1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM8 11a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z" />
        </svg>
      </button>

      {/* Chat panel - bottom sheet on mobile */}
      <div
        className={`chat-overlay lg:hidden ${!showChatPanel ? "closed" : ""}`}
        onClick={() => setShowChatPanel(false)}
      />
      <div
        className={`chat-panel flex lg:hidden ${!showChatPanel ? "closed" : ""}`}
      >
        <div className="chat-panel-header">
          <span
            className="text-[#FFF3D5] uppercase tracking-wider font-headline-md"
            style={{ fontSize: "0.5rem" }}
          >
            {dict.chat.title}
          </span>
          <button
            type="button"
            onClick={() => setShowChatPanel(false)}
            className="chat-panel-close"
            aria-label="Close panel"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="chat-panel-body">
          <div className="flex items-start gap-3">
            <div className="px-badge-robot shrink-0 mt-0.5">
              <svg
                className="w-4 h-4 text-[#06132E]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 110 2h-1v1a7 7 0 01-7 7H9a7 7 0 01-7-7v-1H1a1 1 0 110-2h1v-1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM8 11a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
            </div>
            <div className="px-speech-bubble flex-1">
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.75rem",
                }}
              >
                {dict.aiGreeting}
              </p>
            </div>
          </div>

          <div
            className="text-[#FFF3D5] text-xs"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {dict.chat.emptyHint}
          </div>

          <ChatSection
            dict={dict}
            getCvData={() => getValues()}
            onApplySuggestion={handleApplyChatSuggestion}
            language={lang}
            jobDescription={jobDescription}
            onJobDescriptionChange={setJobDescription}
            compact
          />
        </div>
      </div>
    </>
  );
}
