import { ChatOpenAI } from "@langchain/openai";

export function createLLM() {
  return new ChatOpenAI({
    modelName: "anthropic/claude-sonnet-4",
    openAIApiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
    },
    temperature: 0.7,
  });
}
