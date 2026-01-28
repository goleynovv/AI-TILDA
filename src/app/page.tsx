"use client";

import { useState } from "react";
import { useAppState } from "@/hooks/useAppState";
import ChatPanel from "@/components/chat/ChatPanel";
import PreviewPanel from "@/components/preview/PreviewPanel";

export default function Home() {
  const state = useAppState();
  const [activeTab, setActiveTab] = useState<"chat" | "preview">("chat");

  return (
    <div className="flex h-screen flex-col">
      {/* Mobile tab switcher */}
      <div className="flex border-b border-gray-200 md:hidden">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "chat"
              ? "border-b-2 border-[var(--color-accent)] text-[var(--color-accent)]"
              : "text-gray-500"
          }`}
        >
          Чат
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "preview"
              ? "border-b-2 border-[var(--color-accent)] text-[var(--color-accent)]"
              : "text-gray-500"
          }`}
        >
          Превью
          {state.landingData && (
            <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-green-500" />
          )}
        </button>
      </div>

      {/* Desktop split-screen / Mobile tabs */}
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`w-full flex-col border-r border-gray-200 md:flex md:w-[45%] ${
            activeTab === "chat" ? "flex" : "hidden"
          }`}
        >
          <ChatPanel {...state} />
        </div>
        <div
          className={`w-full bg-gray-50 md:block md:w-[55%] ${
            activeTab === "preview" ? "block" : "hidden"
          }`}
        >
          <PreviewPanel landingData={state.landingData} />
        </div>
      </div>
    </div>
  );
}
