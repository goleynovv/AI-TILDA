import { NextResponse } from "next/server";
import { runGenerator } from "@/lib/agents/generator";
import type { AjtbdState } from "@/types/state";

export const maxDuration = 60;

interface GenerateRequest {
  state: AjtbdState;
}

export async function POST(req: Request) {
  try {
    const { state } = (await req.json()) as GenerateRequest;

    if (!state) {
      return NextResponse.json(
        { error: "state is required" },
        { status: 400 }
      );
    }

    const result = await runGenerator(state);
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
