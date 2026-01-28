import { NextResponse } from "next/server";
import { runEditor } from "@/lib/agents/editor";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { editRequest, currentSiteJson } = await req.json();

    if (!editRequest || !currentSiteJson) {
      return NextResponse.json(
        { error: "editRequest and currentSiteJson are required" },
        { status: 400 }
      );
    }

    const result = await runEditor(
      editRequest,
      JSON.stringify(currentSiteJson, null, 2)
    );
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Edit error:", message);
    return NextResponse.json(
      { error: "Failed to edit landing page", details: message },
      { status: 500 }
    );
  }
}
