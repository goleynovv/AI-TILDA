import { callLLM } from "./model";
import { ANALYZER_SYSTEM_PROMPT } from "../prompts";

export async function runAnalyzer(interviewText: string) {
  const text = await callLLM([
    {
      role: "system",
      content: ANALYZER_SYSTEM_PROMPT + "\n\nОтветь строго в формате JSON без markdown-обёртки.",
    },
    {
      role: "user",
      content: `Транскрипт интервью:\n\n${interviewText}\n\nИзвлеки AJTBD-сущности. Ответь JSON с полями: coreJob, bigJob, pointA (problem, context, emotions), pointB (result, emotions), valueProposition, competitors, barriers.`,
    },
  ]);

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse analyzer response as JSON");
  }

  return JSON.parse(jsonMatch[0]);
}
