import { RunnableSequence, RunnableLambda } from "@langchain/core/runnables";
import { createAnalyzerChain } from "./analyzer";
import { createGeneratorChain } from "./generator";
import type { AjtbdOutput } from "../schemas";

export function createGenerateLandingChain() {
  const analyzerChain = createAnalyzerChain();
  const generatorChain = createGeneratorChain();

  return RunnableSequence.from([
    analyzerChain,
    new RunnableLambda({
      func: (ajtbdAnalysis: AjtbdOutput) => ({
        ajtbdJson: JSON.stringify(ajtbdAnalysis, null, 2),
      }),
    }),
    generatorChain,
  ]);
}
