"use client";

import type { HeroContent } from "@/types/landing";

interface Props {
  content: HeroContent;
  accentColor: string;
}

export default function HeroBlock({ content, accentColor }: Props) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
      <h1 className="max-w-3xl text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
        {content.title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-gray-600">{content.subtitle}</p>
      <button
        className="mt-8 rounded-xl px-8 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: accentColor }}
      >
        {content.ctaText}
      </button>
    </section>
  );
}
