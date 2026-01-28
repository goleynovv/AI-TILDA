"use client";

import type { CompetitorsContent } from "@/types/landing";

interface Props {
  content: CompetitorsContent;
  accentColor: string;
}

export default function CompetitorsBlock({ content, accentColor }: Props) {
  return (
    <section className="px-6 py-16 bg-gray-50">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          {content.title}
        </h2>
        <div className="mt-10 space-y-4">
          {content.points.map((point, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl bg-white p-5 shadow-sm"
            >
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: accentColor }}
              >
                ✓
              </span>
              <p className="text-sm leading-relaxed text-gray-700">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
