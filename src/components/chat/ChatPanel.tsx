"use client";

import { useEffect, useRef } from "react";
import type { AppPhase, ChatMessage as ChatMessageType } from "@/types/chat";
import type { LandingPageData, LandingSettings } from "@/types/landing";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import StylePicker from "./StylePicker";

interface Props {
  phase: AppPhase;
  messages: ChatMessageType[];
  landingData: LandingPageData | null;
  isLoading: boolean;
  sendMessage: (text: string) => void;
  updateStyle: (settings: Partial<LandingSettings>) => void;
  resetChat: () => void;
}

export default function ChatPanel({
  phase,
  messages,
  landingData,
  isLoading,
  sendMessage,
  updateStyle,
  resetChat,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getPlaceholder = () => {
    if (isLoading) return "Подождите...";
    if (phase === "interview") return "Ваш ответ...";
    if (phase === "preview" || phase === "editing")
      return "Напишите, что хотите изменить...";
    return "Напишите сообщение...";
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-gray-900">AI-Tilda</h1>
          <p className="text-xs text-gray-500">ИИ-помощник по созданию сайтов</p>
        </div>
        {landingData && (
          <button
            onClick={resetChat}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Начать заново
          </button>
        )}
      </div>

      <div ref={scrollRef} className="chat-scroll flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-gray-500">
              <span className="inline-flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {(phase === "preview" || phase === "editing") && landingData && (
        <StylePicker settings={landingData.settings} onUpdate={updateStyle} />
      )}

      <ChatInput
        onSend={sendMessage}
        disabled={isLoading || phase === "generating"}
        placeholder={getPlaceholder()}
      />
    </div>
  );
}
