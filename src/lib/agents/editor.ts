import { createLLM } from "./model";
import { EDITOR_SYSTEM_PROMPT } from "../prompts";

export async function runEditor(editRequest: string, currentSiteJson: string) {
  const llm = createLLM();

  const response = await llm.invoke([
    ["system", EDITOR_SYSTEM_PROMPT + "\n\nОтветь строго в формате JSON без markdown-обёртки."],
    ["human", `Запрос пользователя:\n${editRequest}\n\nТекущий JSON сайта:\n${currentSiteJson}\n\nВерни обновлённый JSON.`],
  ]);

  const text = typeof response.content === "string"
    ? response.content
    : JSON.stringify(response.content);

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse editor response as JSON");
  }

  return JSON.parse(jsonMatch[0]);
}
