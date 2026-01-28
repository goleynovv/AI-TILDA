import { ChatOpenAI } from "@langchain/openai";

export function createLLM() {
  return new ChatOpenAI({
    modelName: "anthropic/claude-3.5-haiku",
    openAIApiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
    },
    temperature: 0.7,
  });
}
