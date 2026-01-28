import { NextResponse } from "next/server";
import { runGenerator } from "@/lib/agents/generator";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { ajtbdAnalysis } = await req.json();

    if (!ajtbdAnalysis) {
      return NextResponse.json(
        { error: "ajtbdAnalysis is required" },
        { status: 400 }
      );
    }

    const result = await runGenerator(JSON.stringify(ajtbdAnalysis, null, 2));
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Generate error:", message);
    return NextResponse.json(
      { error: "Failed to generate landing page", details: message },
      { status: 500 }
    );
  }
}
