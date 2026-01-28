import { callLLM } from "./model";
import { GENERATOR_SYSTEM_PROMPT } from "../prompts";

export async function runGenerator(ajtbdJson: string) {
  const text = await callLLM([
    {
      role: "system",
      content: GENERATOR_SYSTEM_PROMPT + "\n\nОтветь строго в формате JSON без markdown-обёртки. JSON должен содержать поля settings и blocks.",
    },
    {
      role: "user",
      content: `AJTBD-анализ продукта:\n\n${ajtbdJson}\n\nСоздай структуру и тексты для лендинга. Ответь JSON.`,
    },
  ]);

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse generator response as JSON");
  }

  return JSON.parse(jsonMatch[0]);
}
