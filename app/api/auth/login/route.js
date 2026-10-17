
import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();

    const username =
      typeof body.username === "string"
        ? body.username.trim().toLowerCase()
        : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    if (
      !/^[a-z0-9_]{3,20}$/.test(username) ||
      password.length < 1 ||
      password.length > 128
    ) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 400 }
      );
    }

    // Look up the username on the server, never in browser code.
    const admin = createAdminClient();

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("id, username, display_name")
      .eq("username", username)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    // Match the internal email used during registration.
    const internalEmail = `${username}@users.casemind.invalid`;

    // This client writes the authenticated session to secure cookies.
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: internalEmail,
      password,
    });

    if (error || !data.user || data.user.id !== profile.id) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Login successful.",
      user: {
        id: profile.id,
        username: profile.username,
        name: profile.display_name,
      },
    });
    
  } catch (error) {
    console.error("Login request failed:", error.message);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
      
    );
    
  }
  
}
