
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json(
      { error: "Could not log out." },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Logged out successfully." });
}
