
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Cases", href: "/cases" },
  { label: "High Scores", href: "/highscores" },
  { label: "My Progress", href: "/progress" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Could not load session");
      }

      const result = await response.json();
      setUser(result.user ?? null);
    } catch (error) {
      console.error("Navbar session check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser, pathname]);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
      router.replace("/signin");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Could not log out. Please try again.");
      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/90 text-white backdrop-blur-xl">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-6 px-6">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-[0.18em]">
          CASE<span className="text-zinc-400">MIND</span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-5">
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(`${link.href}/`));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  active ? "text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                {link.label}
                {active && (
                  <span className="mt-1 block h-0.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}

          {loading ? (
            <span className="px-3 py-2 text-sm text-zinc-500">
              Checking...
            </span>
          ) : user ? (
            <>
              <span className="max-w-32 truncate text-sm text-zinc-300">
                {user.username ? `@${user.username}` : "Detective"}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium transition hover:bg-white hover:text-black disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Log Out"}
              </button>
            </>
          ) : (
            <Link
              href="/signin"
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium transition hover:bg-white hover:text-black"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
