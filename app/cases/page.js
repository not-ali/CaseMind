import Link from "next/link";

const cases = [
  {
    id: 1,
    title: "The Missing Prototype",
    description:
      "A valuable research prototype disappears from a university laboratory. Three people had reasons to be near the project.",
  },
  {
    id: 2,
    title: "The Locked Room",
    description:
      "A confidential document disappears from a room that appears to have been locked from the inside.",
  },
  {
    id: 3,
    title: "The Silent Witness",
    description:
      "An important incident occurs during a university event, but every witness remembers the night differently.",
  },
];

export default function Cases() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            CASE MIND
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Choose Your Case
          </h1>

          <p className="mt-3 text-zinc-400">
            Investigate the evidence, question suspects, and uncover the truth.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-700"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm text-zinc-500">
                  CASE #{String(caseItem.id).padStart(2, "0")}
                </span>

                <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                  Investigation
                </span>
              </div>

              <h2 className="text-xl font-semibold">
                {caseItem.title}
              </h2>

              <p className="mt-3 flex-1 text-sm leading-6 text-zinc-400">
                {caseItem.description}
              </p>

              <Link
                href={`/investigate?case=${caseItem.id}`}
                className="mt-8 block w-full rounded-lg bg-white px-4 py-3 text-center font-semibold text-black transition hover:bg-zinc-200"
              >
                Start Investigation
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}