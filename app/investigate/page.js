
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { cases } from "@/lib/cases";

export default function InvestigatePage() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("case") || "1";
  const caseData = cases[caseId];

  const [progressSaving, setProgressSaving] = useState(false);
  const [progressError, setProgressError] = useState("");
  const [pendingOutcome, setPendingOutcome] = useState(null);

  const [variationIndex, setVariationIndex] = useState(null);
  const [variationReady, setVariationReady] = useState(false);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);

  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");

  const [discoveredClues, setDiscoveredClues] = useState([]);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [showAccusation, setShowAccusation] = useState(false);

  const [accusedSuspect, setAccusedSuspect] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [result, setResult] = useState(null);

  const formatTime = (seconds) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const remainingSeconds = String(seconds % 60).padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
  };

  useEffect(() => {
    if (!caseData || !caseData.variations?.length) {
      setVariationReady(true);
      return;
    }

    const storageKey = `casemind-case-${caseId}-variation`;
    const previousIndex = localStorage.getItem(storageKey);

    let nextIndex = Math.floor(
      Math.random() * caseData.variations.length
    );

    if (caseData.variations.length > 1 && previousIndex !== null) {
      const previous = Number(previousIndex);

      while (nextIndex === previous) {
        nextIndex = Math.floor(
          Math.random() * caseData.variations.length
        );
      }
    }

    setVariationIndex(nextIndex);
    localStorage.setItem(storageKey, String(nextIndex));
    setVariationReady(true);
    setElapsedSeconds(0);
    setTimerRunning(true);
  }, [caseId, caseData]);

  useEffect(() => {
    if (!variationReady || variationIndex === null || !timerRunning) {
      return;
    }

    const timer = setInterval(() => {
      setElapsedSeconds((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [variationReady, variationIndex, timerRunning]);

  const resetInvestigationState = () => {
    setSelectedEvidence(null);
    setSelectedSuspect(null);

    setChatMessages([]);
    setChatInput("");
    setChatError("");
    setChatLoading(false);

    setDiscoveredClues([]);
    setNotes("");
    setShowNotes(false);
    setShowAccusation(false);

    setAccusedSuspect("");
    setReasoning("");
    setResult(null);

    setProgressError("");
    setPendingOutcome(null);
  };

  const restartInvestigation = () => {
    if (!caseData?.variations?.length || progressSaving) {
      return;
    }

    let nextIndex = Math.floor(
      Math.random() * caseData.variations.length
    );

    if (caseData.variations.length > 1) {
      while (nextIndex === variationIndex) {
        nextIndex = Math.floor(
          Math.random() * caseData.variations.length
        );
      }
    }

    setVariationIndex(nextIndex);

    localStorage.setItem(
      `casemind-case-${caseId}-variation`,
      String(nextIndex)
    );

    resetInvestigationState();
    setElapsedSeconds(0);
    setTimerRunning(true);
  };

  const selectEvidence = (item) => {
    setSelectedEvidence(item);
    setSelectedSuspect(null);

    const evidenceId = item.id;

    setDiscoveredClues((previous) =>
      previous.includes(evidenceId)
        ? previous
        : [...previous, evidenceId]
    );
  };

  const selectSuspect = (suspect) => {
    setSelectedSuspect(suspect);
    setSelectedEvidence(null);
    setChatMessages([]);
    setChatInput("");
    setChatError("");
  };

  const askPresetQuestion = (item) => {
    if (!selectedSuspect) return;

    setChatMessages((previous) => [
      ...previous,
      { role: "user", text: item.question },
      {
        role: "model",
        text: item.answer,
        source: "preset",
      },
    ]);
  };

  const sendAIQuestion = async (event) => {
    event.preventDefault();

    const message = chatInput.trim();

    if (
      !message ||
      chatLoading ||
      !selectedSuspect ||
      progressSaving
    ) {
      return;
    }

    const previousMessages = chatMessages;

    setChatInput("");
    setChatError("");
    setChatLoading(true);

    setChatMessages((previous) => [
      ...previous,
      { role: "user", text: message },
    ]);

    try {
      const response = await fetch("/api/interrogate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caseId,
          variationIndex,
          suspectId: selectedSuspect.id,
          history: previousMessages,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "The suspect could not respond."
        );
      }

      setChatMessages((previous) => [
        ...previous,
        { role: "model", text: data.answer },
      ]);
    } catch (error) {
      setChatError(
        error.message || "Something went wrong. Try again."
      );
    } finally {
      setChatLoading(false);
    }
  };

  const saveCompletedInvestigation = async (outcome) => {
    if (
      progressSaving ||
      !["correct", "wrong", "revealed"].includes(outcome)
    ) {
      return false;
    }

    setProgressSaving(true);
    setProgressError("");
    setPendingOutcome(outcome);

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caseId,
          variationIndex,
          outcome,
          elapsedSeconds,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not save progress."
        );
      }

      setResult(outcome);
      setTimerRunning(false);
      setProgressError("");

      return true;
    } catch (error) {
      setProgressError(
        error.message || "Could not save progress."
      );

      return false;
    } finally {
      setProgressSaving(false);
    }
  };

  const makeAccusation = async (event) => {
    event.preventDefault();

    if (
      result !== null ||
      progressSaving ||
      !accusedSuspect ||
      !reasoning.trim()
    ) {
      return;
    }

    const currentVariation = caseData?.variations?.[variationIndex];

    if (!currentVariation) return;

    const outcome =
      accusedSuspect === currentVariation.culprit
        ? "correct"
        : "wrong";

    setTimerRunning(false);
    setShowAccusation(false);

    const saved = await saveCompletedInvestigation(outcome);

    if (!saved) {
      setTimerRunning(true);
    }
  };

  const revealCulprit = async () => {
    if (result !== "wrong" || progressSaving) return;

    await saveCompletedInvestigation("revealed");
  };

  const retryProgressSave = async () => {
    if (!pendingOutcome || progressSaving) return;

    await saveCompletedInvestigation(pendingOutcome);
  };

  if (!caseData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 py-12 text-white">
        <div className="max-w-lg text-center">
          <h1 className="text-3xl font-bold">Case Not Found</h1>

          <p className="mt-4 text-neutral-400">
            The investigation file you requested could not be found.
          </p>

          <Link
            href="/cases"
            className="mt-6 inline-block rounded-lg bg-white px-5 py-3 font-semibold text-black transition hover:bg-neutral-200"
          >
            Return to Cases
          </Link>
        </div>
      </main>
    );
  }

  if (!variationReady || variationIndex === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-neutral-400">
          Preparing investigation...
        </p>
      </main>
    );
  }

  const currentCase = caseData.variations[variationIndex];
  const evidence = currentCase.evidence || [];
  const questions = currentCase.questions || {};

  const progressNotice = progressError ? (
    <div className="mt-4 rounded-lg border border-red-800 bg-red-950/30 p-4">
      <p className="text-sm text-red-300">{progressError}</p>

      <button
        type="button"
        onClick={retryProgressSave}
        disabled={progressSaving}
        className="mt-3 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
      >
        {progressSaving ? "Saving..." : "Retry Save"}
      </button>
    </div>
  ) : null;

  if (result === "correct" || result === "revealed") {
    const culprit = caseData.suspects.find(
      (suspect) => suspect.id === currentCase.culprit
    );

    return (
      <main className="min-h-screen bg-black px-6 py-12 text-white">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/cases"
            className="text-sm text-neutral-400 transition hover:text-white"
          >
            ← Back to Cases
          </Link>

          <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 md:p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">
              {result === "correct" ? "Case Solved" : "Mystery Uncovered"}
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              {result === "correct"
                ? "You found the culprit."
                : "The Culprit Revealed"}
            </h1>

            <p className="mt-4 leading-7 text-neutral-400">
              {result === "correct"
                ? "Your accusation was correct. Your investigation led you to the right conclusion."
                : "The investigation is over. Here is what really happened."}
            </p>

            <p className="mt-4 text-sm text-neutral-400">
              Investigation time:{" "}
              <span className="font-mono text-white">
                {formatTime(elapsedSeconds)}
              </span>
            </p>

            <div className="mt-8 rounded-xl bg-neutral-800 p-6">
              <p className="text-sm text-neutral-400">The Culprit</p>

              <h2 className="mt-2 text-2xl font-semibold">
                {culprit?.name || "Unknown"}
              </h2>

              <p className="mt-1 text-neutral-400">
                {culprit?.role || ""}
              </p>
            </div>

            {result === "correct" && (
              <div className="mt-6 rounded-xl bg-neutral-800 p-6">
                <p className="text-sm text-neutral-400">
                  Your Reasoning
                </p>

                <p className="mt-3 leading-7 text-neutral-300">
                  {reasoning}
                </p>
              </div>
            )}

            <div className="mt-6 rounded-xl border border-neutral-700 bg-black p-6">
              <p className="text-sm text-neutral-400">
                What Actually Happened
              </p>

              <p className="mt-3 leading-7 text-neutral-300">
                {currentCase.solution}
              </p>
            </div>

            {progressNotice}

            <button
              onClick={restartInvestigation}
              disabled={progressSaving}
              className="mt-8 rounded-lg bg-white px-5 py-3 font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
            >
              Play This Case Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (result === "wrong") {
    const accused = caseData.suspects.find(
      (suspect) => suspect.id === accusedSuspect
    );

    return (
      <main className="min-h-screen bg-black px-6 py-12 text-white">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/cases"
            className="text-sm text-neutral-400 transition hover:text-white"
          >
            ← Back to Cases
          </Link>

          <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 md:p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">
              Investigation Update
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              Your accusation was incorrect.
            </h1>

            <p className="mt-4 leading-7 text-neutral-400">
              {accused?.name || "Your chosen suspect"} was not responsible
              for what happened. Reconsider the information you collected
              before reaching another conclusion.
            </p>

            <p className="mt-4 text-sm text-neutral-400">
              Investigation time:{" "}
              <span className="font-mono text-white">
                {formatTime(elapsedSeconds)}
              </span>
            </p>

            <div className="mt-8 rounded-xl bg-neutral-800 p-6">
              <p className="text-sm text-neutral-400">
                Your Reasoning
              </p>

              <p className="mt-3 leading-7 text-neutral-300">
                {reasoning}
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-neutral-700 bg-black p-6">
              <p className="text-sm text-neutral-400">
                Why This Conclusion Was Incorrect
              </p>

              <p className="mt-3 leading-7 text-neutral-300">
                The information you considered does not establish that{" "}
                {accused?.name || "your chosen suspect"} was responsible.
                Suspicious details are not necessarily proof of guilt.
                Review the case before deciding what to do next.
              </p>
            </div>

            {progressNotice}

            <div className="mt-8">
              <button
                onClick={revealCulprit}
                disabled={progressSaving}
                className="rounded-lg border border-neutral-600 px-5 py-3 font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
              >
                {progressSaving && pendingOutcome === "revealed"
                  ? "Saving..."
                  : "Reveal the Culprit"}
              </button>

              <p className="mt-3 text-sm text-neutral-500">
                Your incorrect accusation has been saved. Revealing the
                culprit will also be recorded as a completed investigation.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link
                href="/cases"
                className="text-sm font-medium text-neutral-400 transition hover:text-white"
              >
                ← Cases
              </Link>

              <p className="mt-5 text-sm uppercase tracking-[0.3em] text-neutral-500">
                Case #{String(caseId).padStart(2, "0")}
              </p>

              <div className="mt-4 inline-flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3">
                <span className="text-sm text-neutral-400">
                  Investigation Time
                </span>

                <span className="font-mono text-lg font-semibold tabular-nums text-white">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
            </div>

            <button
              onClick={restartInvestigation}
              disabled={progressSaving}
              className="rounded-lg border border-neutral-800 px-4 py-2 text-sm text-neutral-300 transition hover:bg-neutral-900 hover:text-white disabled:opacity-50"
            >
              Restart Case
            </button>
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {caseData.title}
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-neutral-400">
            {caseData.description}
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Evidence</h2>

              <span className="text-sm text-neutral-500">
                {discoveredClues.length} / {evidence.length} examined
              </span>
            </div>

            {evidence.length > 0 ? (
              <div className="mt-5 space-y-3">
                {evidence.map((item, index) => {
                  const itemId = item.id ?? index;
                  const itemName = item.name || item.title || "Evidence";
                  const isDiscovered = discoveredClues.includes(itemId);

                  return (
                    <button
                      key={itemId}
                      onClick={() => selectEvidence(item)}
                      className={
                        "w-full rounded-xl border p-4 text-left transition " +
                        (selectedEvidence?.id === item.id
                          ? "border-white bg-neutral-800"
                          : "border-neutral-800 bg-neutral-800 hover:border-neutral-600 hover:bg-neutral-700")
                      }
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">{itemName}</p>

                        <span className="text-xs text-neutral-400">
                          {isDiscovered ? "Examined" : "Inspect →"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-neutral-500">
                        {isDiscovered
                          ? "You have examined this item."
                          : "Select to inspect evidence"}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-neutral-700 p-6 text-center">
                <p className="text-neutral-300">No evidence added yet</p>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Evidence and clues will appear here once we develop the
                  case content.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-xl font-semibold">Suspects</h2>

            <p className="mt-2 text-sm text-neutral-500">
              Review the people connected to this case.
            </p>

            <div className="mt-5 space-y-3">
              {caseData.suspects.map((suspect) => (
                <button
                  key={suspect.id}
                  onClick={() => selectSuspect(suspect)}
                  className={
                    "w-full rounded-xl border p-4 text-left transition " +
                    (selectedSuspect?.id === suspect.id
                      ? "border-white bg-neutral-800"
                      : "border-neutral-800 bg-neutral-800 hover:border-neutral-600 hover:bg-neutral-700")
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{suspect.name}</p>

                      <p className="mt-1 text-sm text-neutral-400">
                        {suspect.role}
                      </p>
                    </div>

                    <span className="text-sm text-neutral-400">→</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Detective Notebook</h2>

              <p className="mt-1 text-sm text-neutral-500">
                Record anything you think may be important.
              </p>
            </div>

            <button
              onClick={() => setShowNotes(!showNotes)}
              className="rounded-lg bg-neutral-800 px-4 py-2 text-sm transition hover:bg-neutral-700"
            >
              {showNotes ? "Close Notebook" : "Open Notebook"}
            </button>
          </div>

          {showNotes && (
            <div className="mt-5">
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Write your observations and deductions here..."
                rows={6}
                className="w-full resize-y rounded-xl border border-neutral-700 bg-black p-4 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-neutral-500"
              />
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          {!selectedEvidence && !selectedSuspect && (
            <div>
              <h2 className="text-xl font-semibold">Investigation</h2>

              <p className="mt-3 leading-7 text-neutral-400">
                Examine evidence and question suspects carefully. Important
                information may only become meaningful when combined with
                other details.
              </p>
            </div>
          )}

          {selectedEvidence && (
            <div>
              <p className="text-sm uppercase tracking-widest text-neutral-500">
                Evidence Inspection
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                {selectedEvidence.name || selectedEvidence.title || "Evidence"}
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-neutral-400">
                {selectedEvidence.description || "No further details available."}
              </p>

              <button
                onClick={() => setSelectedEvidence(null)}
                className="mt-6 rounded-lg bg-neutral-800 px-4 py-2 text-sm transition hover:bg-neutral-700"
              >
                Close Evidence
              </button>
            </div>
          )}

          {selectedSuspect && (
            <div>
              <p className="text-sm uppercase tracking-widest text-neutral-500">
                Interrogation
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                {selectedSuspect.name}
              </h2>

              <p className="mt-1 text-neutral-400">
                {selectedSuspect.role}
              </p>

              {Array.isArray(questions[selectedSuspect.id]) &&
              questions[selectedSuspect.id].length > 0 ? (
                <div className="mt-6">
                  <p className="mb-3 text-sm font-medium text-neutral-400">
                    Suggested questions
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {questions[selectedSuspect.id].map((item, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => askPresetQuestion(item)}
                        className="rounded-full border border-neutral-700 px-4 py-2 text-left text-sm text-neutral-300 transition hover:border-neutral-500 hover:bg-neutral-800"
                      >
                        {item.question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-xl border border-dashed border-neutral-700 p-6">
                  <p className="font-medium">Interrogation coming soon</p>

                  <p className="mt-2 text-sm leading-6 text-neutral-400">
                    We will add this suspect&apos;s questions and answers
                    when we develop the investigation content.
                  </p>
                </div>
              )}

              <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-800 bg-black">
                <div className="border-b border-neutral-800 px-5 py-4">
                  <h3 className="font-semibold">Interrogation Room</h3>

                  <p className="mt-1 text-xs text-neutral-500">
                    Speaking with {selectedSuspect.name}
                  </p>
                </div>

                <div className="max-h-96 min-h-40 space-y-4 overflow-y-auto p-5">
                  {chatMessages.length === 0 && (
                    <div className="flex min-h-28 flex-col items-center justify-center text-center">
                      <p className="text-sm text-neutral-300">
                        Start the interrogation
                      </p>

                      <p className="mt-2 max-w-sm text-xs leading-5 text-neutral-500">
                        Choose a suggested question above or ask the suspect
                        something yourself.
                      </p>
                    </div>
                  )}

                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={
                        message.role === "user"
                          ? "flex justify-end"
                          : "flex justify-start"
                      }
                    >
                      <div
                        className={
                          "max-w-[90%] rounded-2xl px-4 py-3 " +
                          (message.role === "user"
                            ? "rounded-br-sm bg-neutral-700 text-white"
                            : "rounded-bl-sm border border-neutral-800 bg-neutral-900 text-neutral-300")
                        }
                      >
                        <p className="mb-1 text-xs font-medium text-neutral-500">
                          {message.role === "user"
                            ? "Detective"
                            : selectedSuspect.name}
                          {message.source === "preset" ? " · Case file" : ""}
                        </p>

                        <p className="whitespace-pre-wrap text-sm leading-6">
                          {message.text}
                        </p>
                      </div>
                    </div>
                  ))}

                  {chatLoading && (
                    <p className="text-sm text-neutral-500">
                      {selectedSuspect.name} is responding...
                    </p>
                  )}
                </div>

                {chatError && (
                  <p className="px-5 pb-3 text-sm text-red-400">
                    {chatError}
                  </p>
                )}

                <form
                  onSubmit={sendAIQuestion}
                  className="border-t border-neutral-800 p-4"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      maxLength={1000}
                      placeholder={`Ask ${selectedSuspect.name} a question...`}
                      disabled={chatLoading || progressSaving}
                      className="min-w-0 flex-1 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-neutral-600 disabled:opacity-50"
                    />

                    <button
                      type="submit"
                      disabled={
                        chatLoading || !chatInput.trim() || progressSaving
                      }
                      className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>

              <button
                onClick={() => setSelectedSuspect(null)}
                className="mt-6 rounded-lg bg-neutral-800 px-4 py-2 text-sm transition hover:bg-neutral-700"
              >
                End Interrogation
              </button>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Final Accusation</h2>

              <p className="mt-1 text-sm text-neutral-500">
                Make an accusation when you can explain your conclusion.
              </p>
            </div>

            <button
              onClick={() => setShowAccusation(!showAccusation)}
              disabled={progressSaving}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
            >
              {showAccusation ? "Close" : "Make Accusation"}
            </button>
          </div>

          {!result && progressNotice}

          {showAccusation && (
            <form
              onSubmit={makeAccusation}
              className="mt-6 border-t border-neutral-800 pt-6"
            >
              <label className="text-sm text-neutral-400">
                Who do you accuse?
              </label>

              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {caseData.suspects.map((suspect) => (
                  <button
                    key={suspect.id}
                    type="button"
                    onClick={() => setAccusedSuspect(suspect.id)}
                    className={
                      "rounded-xl border p-4 text-left transition " +
                      (accusedSuspect === suspect.id
                        ? "border-white bg-neutral-800"
                        : "border-neutral-800 bg-black hover:border-neutral-600 hover:bg-neutral-800")
                    }
                  >
                    <p className="font-medium">{suspect.name}</p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {suspect.role}
                    </p>
                  </button>
                ))}
              </div>

              <label
                htmlFor="reasoning"
                className="mt-6 block text-sm text-neutral-400"
              >
                Why are you accusing this person?
              </label>

              <textarea
                id="reasoning"
                value={reasoning}
                onChange={(event) => setReasoning(event.target.value)}
                required
                placeholder="Explain the evidence and reasoning behind your accusation..."
                rows={5}
                className="mt-3 w-full resize-y rounded-xl border border-neutral-700 bg-black p-4 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-neutral-500"
              />

              <button
                type="submit"
                disabled={
                  !accusedSuspect || !reasoning.trim() || progressSaving
                }
                className="mt-5 rounded-lg bg-white px-5 py-3 font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
              >
                {progressSaving ? "Saving Investigation..." : "Submit Accusation"}
              </button>
            </form>
          )}
        </section>

        <footer className="py-8 text-center">
          <p className="text-xs uppercase tracking-widest text-neutral-600">
            CaseMind — Every Detail Matters
          </p>
        </footer>
      </div>
    </main>
  );
}
