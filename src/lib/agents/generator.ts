import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createLLM } from "./model";
import { landingPageSchema } from "../schemas";
import { GENERATOR_SYSTEM_PROMPT } from "../prompts";

export function createGeneratorChain() {
  const llm = createLLM();
  const structuredLlm = llm.withStructuredOutput(landingPageSchema);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", GENERATOR_SYSTEM_PROMPT],
    ["human", "AJTBD-анализ продукта:\n\n{ajtbdJson}\n\nСоздай структуру и тексты для лендинга."],
  ]);

  return prompt.pipe(structuredLlm);
}
