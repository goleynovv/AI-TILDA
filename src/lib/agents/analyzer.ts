import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createLLM } from "./model";
import { ajtbdSchema } from "../schemas";
import { ANALYZER_SYSTEM_PROMPT } from "../prompts";

export function createAnalyzerChain() {
  const llm = createLLM();
  const structuredLlm = llm.withStructuredOutput(ajtbdSchema);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", ANALYZER_SYSTEM_PROMPT],
    ["human", "Транскрипт интервью:\n\n{interviewText}\n\nИзвлеки AJTBD-сущности."],
  ]);

  return prompt.pipe(structuredLlm);
}
