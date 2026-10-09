import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tight">
          CaseMind
        </h1>

        <p className="mt-4 text-zinc-400 text-lg">
          Every clue matters. Every case has a story.
        </p>

        <Link
          href="/cases"
          className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-zinc-200"
        >
          Start Investigation
        </Link>
      </div>
    </main>
  );
}