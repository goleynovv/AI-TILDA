"use client";

import { useState, useCallback } from "react";
import type { AppPhase, ChatMessage } from "@/types/chat";
import type { LandingPageData, LandingSettings } from "@/types/landing";
import type { AjtbdState } from "@/types/state";
import { createEmptyState } from "@/types/state";

const GREETING_MESSAGE = `Привет! Я ваш личный ИИ-маркетолог. Моя задача — помочь вам создать продающий лендинг.

Расскажите мне о вашем продукте или услуге, как другу за чашкой кофе. Что это такое и для кого?

Можете описать своими словами — чем больше деталей, тем лучше получится результат.`;

const GENERATING_MESSAGE =
  "Отлично, у меня достаточно информации! Сейчас создам для вас лендинг. Это займет немного времени...";

const READY_MESSAGE =
  "Готово! Я всё проанализировал и собрал для вас прототип сайта. Посмотрите справа, как вам? Вы можете выбрать стиль оформления ниже, или просто напишите мне, что хотите изменить.";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function buildConversationHistory(messages: ChatMessage[]): string {
  return messages
    .map((m) => `${m.role === "user" ? "Пользователь" : "Ассистент"}: ${m.content}`)
    .join("\n\n");
}

export function useAppState() {
  const [phase, setPhase] = useState<AppPhase>("interview");
  const [ajtbdState, setAjtbdState] = useState<AjtbdState>(createEmptyState());
  const [landingData, setLandingData] = useState<LandingPageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: generateId(), role: "assistant", content: GREETING_MESSAGE },
  ]);

  const addMessage = useCallback(
    (role: "user" | "assistant", content: string) => {
      setMessages((prev) => [...prev, { id: generateId(), role, content }]);
    },
    []
  );

  const handleGenerate = useCallback(
    async (state: AjtbdState) => {
      setPhase("generating");
      addMessage("assistant", GENERATING_MESSAGE);
      setIsLoading(true);

      try {
        const generateResponse = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ state }),
        });

        if (!generateResponse.ok) {
          const err = await generateResponse.json().catch(() => ({}));
          throw new Error(err.details || "Generation failed");
        }

        const data = await generateResponse.json();
        setLandingData(data as LandingPageData);
        setPhase("preview");
        addMessage("assistant", READY_MESSAGE);
      } catch (error) {
        console.error("Generation error:", error);
        const msg = error instanceof Error ? error.message : "";
        addMessage(
          "assistant",
          `Произошла ошибка при генерации${msg ? `: ${msg}` : ""}. Попробуйте ещё раз.`
        );
        setPhase("interview");
        setAjtbdState(createEmptyState());
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage]
  );

  const handleInterview = useCallback(
    async (userMessage: string, currentMessages: ChatMessage[]) => {
      setIsLoading(true);

      try {
        const conversationHistory = buildConversationHistory(currentMessages);

        const response = await fetch("/api/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            state: ajtbdState,
            userMessage,
            conversationHistory,
          }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.details || "Interview failed");
        }

        const data = await response.json();

        // Update state with new values
        setAjtbdState(data.state);

        // Add assistant's next message
        addMessage("assistant", data.assistantMessage);

        // If interview is complete, trigger generation
        if (data.isComplete) {
          await handleGenerate(data.state);
        }
      } catch (error) {
        console.error("Interview error:", error);
        addMessage(
          "assistant",
          "Произошла ошибка. Расскажите ещё раз о вашем продукте."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [ajtbdState, addMessage, handleGenerate]
  );

  const handleEdit = useCallback(
    async (editRequest: string) => {
      if (!landingData) return;

      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            editRequest,
            currentSiteJson: landingData,
          }),
        });

        if (!response.ok) {
          throw new Error("Edit failed");
        }

        const data = await response.json();
        setLandingData(data as LandingPageData);
        addMessage("assistant", "Готово, я внёс изменения! Посмотрите справа.");
      } catch (error) {
        console.error("Edit error:", error);
        addMessage(
          "assistant",
          "Не удалось внести изменения. Попробуйте переформулировать запрос."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [landingData, addMessage]
  );

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      addMessage("user", trimmed);

      // Get current messages including the new user message
      const currentMessages = [...messages, { id: generateId(), role: "user" as const, content: trimmed }];

      switch (phase) {
        case "interview": {
          handleInterview(trimmed, currentMessages);
          break;
        }

        case "preview": {
          setPhase("editing");
          handleEdit(trimmed);
          break;
        }

        case "editing": {
          handleEdit(trimmed);
          break;
        }

        default:
          break;
      }
    },
    [phase, messages, isLoading, addMessage, handleInterview, handleEdit]
  );

  const updateStyle = useCallback(
    (settings: Partial<LandingSettings>) => {
      if (!landingData) return;
      setLandingData({
        ...landingData,
        settings: { ...landingData.settings, ...settings },
      });
    },
    [landingData]
  );

  const resetChat = useCallback(() => {
    setPhase("interview");
    setAjtbdState(createEmptyState());
    setLandingData(null);
    setIsLoading(false);
    setMessages([{ id: generateId(), role: "assistant", content: GREETING_MESSAGE }]);
  }, []);

  return {
    phase,
    messages,
    landingData,
    isLoading,
    sendMessage,
    updateStyle,
    resetChat,
  };
}
