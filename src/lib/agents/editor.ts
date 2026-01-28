import { callLLM } from "./model";
import { EDITOR_SYSTEM_PROMPT } from "../prompts";

export async function runEditor(editRequest: string, currentSiteJson: string) {
  const text = await callLLM([
    {
      role: "system",
      content: EDITOR_SYSTEM_PROMPT + "\n\nОтветь строго в формате JSON без markdown-обёртки.",
    },
    {
      role: "user",
      content: `Запрос пользователя:\n${editRequest}\n\nТекущий JSON сайта:\n${currentSiteJson}\n\nВерни обновлённый JSON.`,
    },
  ]);

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse editor response as JSON");
  }

  return JSON.parse(jsonMatch[0]);
}
