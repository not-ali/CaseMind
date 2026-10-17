
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please sign in to save progress." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const caseId = String(body.caseId ?? "");
    const variationIndex = body.variationIndex;
    const outcome = body.outcome;
    const elapsedSeconds = body.elapsedSeconds;

    if (
      !/^[1-9]\d*$/.test(caseId) ||
      !Number.isInteger(variationIndex) ||
      variationIndex < 0 ||
      !["correct", "wrong", "revealed"].includes(outcome) ||
      !Number.isInteger(elapsedSeconds) ||
      elapsedSeconds < 0 ||
      elapsedSeconds > 86400
    ) {
      return NextResponse.json(
        { error: "Invalid progress data." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("player_progress")
      .insert({
        user_id: user.id,
        case_id: caseId,
        variation_index: variationIndex,
        outcome,
        elapsed_seconds: elapsedSeconds,
        status: "completed",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Progress save failed:", error.message);

      return NextResponse.json(
        { error: "Could not save investigation progress." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Progress saved.", id: data.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Progress API failed:", error.message);

    return NextResponse.json(
      { error: "Something went wrong while saving progress." },
      { status: 500 }
    );
  }
}
