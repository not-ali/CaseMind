
import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const username =
      typeof body.username === "string"
        ? body.username.trim().toLowerCase()
        : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    if (
      name.length < 2 ||
      name.length > 60 ||
      !/^[a-z0-9_]{3,20}$/.test(username) ||
      password.length < 8 ||
      password.length > 128
    ) {
      return NextResponse.json(
        {
          error:
            "Enter a name (2–60 characters), a username (3–20 letters, numbers or underscores), and a password (8–128 characters).",
        },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Reserve an internal account email so players don't need
    // to enter an email address in the CaseMind interface.
    const internalEmail = `${username}@users.casemind.invalid`;

    const { data, error } = await supabase.auth.admin.createUser({
      email: internalEmail,
      password,
      email_confirm: true,
    });

    if (error || !data.user) {
      // Avoid returning internal Supabase details to the browser.
      return NextResponse.json(
        { error: "Registration failed. Try another username." },
        { status: 409 }
      );
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        username,
        display_name: name,
      });

    if (profileError) {
      // Roll back account creation if the profile cannot be saved.
      await supabase.auth.admin.deleteUser(data.user.id);

      if (profileError.code === "23505") {
        return NextResponse.json(
          { error: "That username is already taken." },
          { status: 409 }
        );
      }

      console.error("Profile creation failed:", {
  code: profileError.code,
  message: profileError.message,
  details: profileError.details,
  hint: profileError.hint,
});

      return NextResponse.json(
        { error: "Could not create your profile. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: data.user.id,
          username,
          name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration request failed:", error.message);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
