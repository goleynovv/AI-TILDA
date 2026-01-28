import { NextResponse } from "next/server";
import {
  runInterviewer,
  applyStateUpdates,
} from "@/lib/agents/interviewer";
import type { AjtbdState } from "@/types/state";

export const maxDuration = 60;

interface InterviewRequest {
  state: AjtbdState;
  userMessage: string;
  conversationHistory: string;
}

export async function POST(req: Request) {
  try {
    const { state, userMessage, conversationHistory } =
      (await req.json()) as InterviewRequest;

    if (!state || !userMessage) {
      return NextResponse.json(
        { error: "state and userMessage are required" },
        { status: 400 }
      );
    }

    const result = await runInterviewer(
      state,
      userMessage,
      conversationHistory || ""
    );

    const updatedState = applyStateUpdates(state, result.stateUpdates);
    const updatedFields = Object.keys(result.stateUpdates);

    return NextResponse.json({
      state: updatedState,
      assistantMessage: result.nextMessage,
      isComplete: result.isComplete,
      updatedFields,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Interview error:", message);
    return NextResponse.json(
      { error: "Failed to process interview", details: message },
      { status: 500 }
    );
  }
}
