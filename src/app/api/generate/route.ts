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
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate landing page" },
      { status: 500 }
    );
  }
}
