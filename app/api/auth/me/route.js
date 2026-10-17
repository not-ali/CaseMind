
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ user: null });
    }

    const admin = createAdminClient();

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("username, display_name")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Profile lookup failed:", profileError.message);
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: profile?.username ?? null,
        name: profile?.display_name ?? null,
      },
    });
  } catch (error) {
    console.error("Session lookup failed:", error.message);

    return NextResponse.json(
      { error: "Could not check your session." },
      { status: 500 }
    );
  }
}
