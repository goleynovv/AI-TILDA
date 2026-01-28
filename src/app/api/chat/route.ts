import { NextResponse } from "next/server";
import { createEditorChain } from "@/lib/agents/editor";

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

    const chain = createEditorChain();
    const result = await chain.invoke({
      editRequest,
      currentSiteJson: JSON.stringify(currentSiteJson, null, 2),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Edit error:", error);
    return NextResponse.json(
      { error: "Failed to edit landing page" },
      { status: 500 }
    );
  }
}
