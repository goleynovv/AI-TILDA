"use client";

import { useState, useCallback } from "react";
import type { AppPhase, ChatMessage } from "@/types/chat";
import type { LandingPageData, LandingSettings } from "@/types/landing";
import {
  GREETING,
  INTERVIEW_QUESTIONS,
  GENERATING_MESSAGE,
  READY_MESSAGE,
  buildInterviewText,
} from "@/lib/interview";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function useAppState() {
  const [phase, setPhase] = useState<AppPhase>("interview");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [landingData, setLandingData] = useState<LandingPageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: generateId(), role: "assistant", content: GREETING },
  ]);

  const addMessage = useCallback(
    (role: "user" | "assistant", content: string) => {
      setMessages((prev) => [...prev, { id: generateId(), role, content }]);
    },
    []
  );

  const handleGenerate = useCallback(
    async (allAnswers: string[]) => {
      setPhase("generating");
      addMessage("assistant", GENERATING_MESSAGE);
      setIsLoading(true);

      try {
        const interviewText = buildInterviewText(allAnswers);

        // Step 1: Analyze interview (AJTBD extraction)
        addMessage("assistant", "Анализирую ваш бизнес...");
        const analyzeResponse = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interviewText }),
        });

        if (!analyzeResponse.ok) {
          const err = await analyzeResponse.json().catch(() => ({}));
          throw new Error(err.details || "Analysis failed");
        }

        const ajtbdAnalysis = await analyzeResponse.json();

        // Step 2: Generate landing page from analysis
        addMessage("assistant", "Создаю лендинг на основе анализа...");
        const generateResponse = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ajtbdAnalysis }),
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
        setCurrentQuestion(0);
        setAnswers([]);
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage]
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

      switch (phase) {
        case "interview": {
          const newAnswers = [...answers, trimmed];
          setAnswers(newAnswers);

          if (currentQuestion < INTERVIEW_QUESTIONS.length) {
            addMessage("assistant", INTERVIEW_QUESTIONS[currentQuestion]);
            setCurrentQuestion((prev) => prev + 1);
          } else {
            handleGenerate(newAnswers);
          }
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
    [phase, currentQuestion, answers, isLoading, addMessage, handleGenerate, handleEdit]
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
    setCurrentQuestion(0);
    setAnswers([]);
    setLandingData(null);
    setIsLoading(false);
    setMessages([{ id: generateId(), role: "assistant", content: GREETING }]);
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
