
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function SigninPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to sign in.");
        return;
      }

       router.replace("/cases?auth=login");
router.refresh();
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

        <h1 className="text-3xl font-bold tracking-tight">Welcome back, detective.</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Sign in to continue your investigations.
        </p>

        {searchParams.get("registered") === "1" && (
          <p className="mt-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
            Account created! Sign in with your new credentials.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={fieldClass}
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-zinc-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldClass}
              placeholder="Enter your password"
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          New to CaseMind?{" "}
          <Link href="/signup" className="font-medium text-white underline underline-offset-4 hover:text-red-300">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
