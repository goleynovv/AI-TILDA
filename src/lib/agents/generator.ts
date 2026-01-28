import { createLLM } from "./model";
import { GENERATOR_SYSTEM_PROMPT } from "../prompts";

export async function runGenerator(ajtbdJson: string) {
  const llm = createLLM();

  const response = await llm.invoke([
    ["system", GENERATOR_SYSTEM_PROMPT + "\n\nОтветь строго в формате JSON без markdown-обёртки. JSON должен содержать поля settings и blocks."],
    ["human", `AJTBD-анализ продукта:\n\n${ajtbdJson}\n\nСоздай структуру и тексты для лендинга. Ответь JSON.`],
  ]);

  const text = typeof response.content === "string"
    ? response.content
    : JSON.stringify(response.content);

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse generator response as JSON");
  }

  return JSON.parse(jsonMatch[0]);
}
