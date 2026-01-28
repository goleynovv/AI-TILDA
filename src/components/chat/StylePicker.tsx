"use client";

import type { LandingSettings } from "@/types/landing";

interface Props {
  settings: LandingSettings;
  onUpdate: (settings: Partial<LandingSettings>) => void;
}

const MOODS: { value: LandingSettings["mood"]; label: string }[] = [
  { value: "strict", label: "Строгий" },
  { value: "minimal", label: "Минималистичный" },
  { value: "friendly", label: "Дружелюбный" },
  { value: "creative", label: "Креативный" },
];

const COLORS = [
  "#007AFF",
  "#FF3B30",
  "#34C759",
  "#FF9500",
  "#AF52DE",
  "#5856D6",
  "#FF2D55",
  "#00C7BE",
];

export default function StylePicker({ settings, onUpdate }: Props) {
  return (
    <div className="mx-4 mb-4 rounded-xl border border-gray-200 bg-white p-4 space-y-4">
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2">Настроение</p>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((mood) => (
            <button
              key={mood.value}
              onClick={() => onUpdate({ mood: mood.value })}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                settings.mood === mood.value
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {mood.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-500 mb-2">Акцентный цвет</p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onUpdate({ accentColor: color })}
              className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                settings.accentColor === color
                  ? "border-gray-900 scale-110"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
