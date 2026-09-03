"use client";

import Link from "next/link";
import { useFlashcards } from "@/lib/flashcards/context";
import { getFlashcardStatus } from "@/lib/flashcards/types";
import { EmptyState } from "@/components/EmptyState";

export default function Home() {
  const { cards } = useFlashcards();

  const learned = cards.filter((c) => getFlashcardStatus(c) === "learned").length;
  const needsPractice = cards.filter(
    (c) => getFlashcardStatus(c) === "needs-practice",
  ).length;
  const isNew = cards.length - learned - needsPractice;

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="text-2xl font-semibold">der · die · das</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          A flashcard game for learning German noun articles — and the rules
          (and exceptions) behind them.
        </p>
      </section>

      <section className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <h2 className="font-semibold">How to use this app</h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>
            Add flashcards under{" "}
            <Link href="/cards" className="underline underline-offset-2">
              Manage cards
            </Link>{" "}
            — a noun, its correct article, the rule behind it, and any
            exception to that rule.
          </li>
          <li>
            Go to{" "}
            <Link href="/practice" className="underline underline-offset-2">
              Practice
            </Link>{" "}
            to guess der/die/das for each noun and see the rule and exception
            explained.
          </li>
          <li>
            Answer a card correctly twice in a row and it becomes{" "}
            <strong>Learned</strong>; miss it twice in a row and it becomes{" "}
            <strong>Needs practice</strong>.
          </li>
        </ol>
      </section>

      {cards.length === 0 ? (
        <EmptyState
          title="No flashcards yet"
          description="Add your first noun to start building your deck."
          actionHref="/cards/new"
          actionLabel="Add a flashcard"
        />
      ) : (
        <section className="grid grid-cols-3 gap-3">
          <Stat label="Learned" value={learned} />
          <Stat label="Needs practice" value={needsPractice} />
          <Stat label="New" value={isNew} />
        </section>
      )}

      <section className="flex gap-3">
        <Link
          href="/practice"
          className="inline-flex items-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Start practicing
        </Link>
        <Link
          href="/cards"
          className="inline-flex items-center rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Manage cards
        </Link>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-4 text-center dark:border-zinc-800">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-zinc-500 dark:text-zinc-400">{label}</div>
    </div>
  );
}
