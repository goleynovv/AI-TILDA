import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createLLM } from "./model";
import { landingPageSchema } from "../schemas";
import { EDITOR_SYSTEM_PROMPT } from "../prompts";

export function createEditorChain() {
  const llm = createLLM();
  const structuredLlm = llm.withStructuredOutput(landingPageSchema);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", EDITOR_SYSTEM_PROMPT],
    [
      "human",
      "Запрос пользователя:\n{editRequest}\n\nТекущий JSON сайта:\n{currentSiteJson}\n\nВерни обновлённый JSON.",
    ],
  ]);

  return prompt.pipe(structuredLlm);
}
