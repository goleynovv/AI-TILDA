"use client";

import type { FeaturesContent } from "@/types/landing";

interface Props {
  content: FeaturesContent;
  accentColor: string;
}

const ICON_MAP: Record<string, string> = {
  check: "\u2705",
  smile: "\ud83d\ude0a",
  rocket: "\ud83d\ude80",
  shield: "\ud83d\udee1\ufe0f",
  clock: "\u23f0",
  star: "\u2b50",
  heart: "\u2764\ufe0f",
  target: "\ud83c\udfaf",
};

function getIcon(icon: string): string {
  return ICON_MAP[icon] || "\u2705";
}

export default function FeaturesBlock({ content, accentColor }: Props) {
  return (
    <section className="px-6 py-16 bg-gray-50">
      <div className="mx-auto max-w-4xl">
        <h2
          className="text-center text-3xl font-bold"
          style={{ color: accentColor }}
        >
          {content.title}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {content.items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm"
            >
              <span className="text-2xl">{getIcon(item.icon)}</span>
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-700">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
