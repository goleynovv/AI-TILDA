import { NextResponse } from "next/server";
import { createGenerateLandingChain } from "@/lib/agents/chain";

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

    const chain = createGenerateLandingChain();
    const result = await chain.invoke({ interviewText });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    console.error("Generate error:", message, stack);
    return NextResponse.json(
      { error: "Failed to generate landing page", details: message },
      { status: 500 }
    );
  }
}
