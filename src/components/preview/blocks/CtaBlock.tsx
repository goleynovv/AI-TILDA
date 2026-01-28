"use client";

import type { CtaContent } from "@/types/landing";

interface Props {
  content: CtaContent;
  accentColor: string;
}

export default function CtaBlock({ content, accentColor }: Props) {
  return (
    <section
      className="px-6 py-20 text-center text-white"
      style={{ backgroundColor: accentColor }}
    >
      <div className="mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold">{content.title}</h2>
        <p className="mt-4 text-lg opacity-90">{content.description}</p>
        <button className="mt-8 rounded-xl bg-white px-8 py-3.5 text-base font-semibold transition-opacity hover:opacity-90"
          style={{ color: accentColor }}
        >
          {content.buttonText}
        </button>
      </div>
    </section>
  );
}
