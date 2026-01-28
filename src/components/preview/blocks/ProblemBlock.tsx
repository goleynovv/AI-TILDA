"use client";

import type { ProblemContent } from "@/types/landing";

interface Props {
  content: ProblemContent;
}

export default function ProblemBlock({ content }: Props) {
  return (
    <section className="px-6 py-16 bg-gray-900 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold">{content.title}</h2>
        <p className="mt-6 text-lg leading-relaxed text-gray-300">
          {content.description}
        </p>
      </div>
    </section>
  );
}
