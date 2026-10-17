
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Registration failed.");
        return;
      }

      // Sign in separately until registration creates a session.
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

       if (loginResponse.ok) {
  router.push("/cases?auth=registered");
  router.refresh();
} else {
  router.push("/signin?registered=1");
}
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "w-full rounded-lg border border-white/15 bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-red-400";

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-zinc-950 px-5 py-12 text-white">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/80 p-7 shadow-2xl sm:p-9">
        <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-red-400">
          CASEMIND DETECTIVE AGENCY
        </p>

        <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Your investigations begin here.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm text-zinc-300">
              Name
            </label>
            <input
              id="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="username" className="mb-2 block text-sm text-zinc-300">
              Username
            </label>
            <input
              id="username"
              autoComplete="username"
              required
              minLength={3}
              maxLength={20}
              pattern="[A-Za-z0-9_]+"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={fieldClass}
              placeholder="Choose a username"
            />
            <p className="mt-1 text-xs text-zinc-500">
              3–20 letters, numbers, or underscores.
            </p>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-zinc-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldClass}
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm text-zinc-300">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={fieldClass}
              placeholder="Enter your password again"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-700 px-4 py-3 font-semibold transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/signin" className="font-medium text-white underline underline-offset-4 hover:text-red-300">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
