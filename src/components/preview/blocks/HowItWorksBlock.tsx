"use client";

import type { HowItWorksContent } from "@/types/landing";

interface Props {
  content: HowItWorksContent;
  accentColor: string;
}

export default function HowItWorksBlock({ content, accentColor }: Props) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          {content.title}
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {content.steps.map((step, i) => (
            <div key={i} className="text-center">
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
                style={{ backgroundColor: accentColor }}
              >
                {i + 1}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
