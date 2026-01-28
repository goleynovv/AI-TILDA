import { NextResponse } from "next/server";
import { createAnalyzerChain } from "@/lib/agents/analyzer";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { interviewText } = await req.json();

    if (!interviewText) {
      return NextResponse.json(
        { error: "interviewText is required" },
        { status: 400 }
      );
    }

    const chain = createAnalyzerChain();
    const result = await chain.invoke({ interviewText });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Analyze error:", message);
    return NextResponse.json(
      { error: "Failed to analyze interview", details: message },
      { status: 500 }
    );
  }
}
