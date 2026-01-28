"use client";

import type { LandingPageData } from "@/types/landing";
import LandingRenderer from "./LandingRenderer";

interface Props {
  landingData: LandingPageData | null;
}

export default function PreviewPanel({ landingData }: Props) {
  if (!landingData) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">🌐</div>
          <p className="text-gray-400 text-sm">
            Ваш лендинг появится здесь
          </p>
          <p className="text-gray-300 text-xs mt-1">
            Ответьте на вопросы в чате слева
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <LandingRenderer data={landingData} />
    </div>
  );
}
