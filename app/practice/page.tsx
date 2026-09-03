"use client";

import { useMemo, useState } from "react";
import { useFlashcards } from "@/lib/flashcards/context";
import { ARTICLES, getFlashcardStatus, type Article } from "@/lib/flashcards/types";
import { buildPracticeOrder } from "@/lib/flashcards/practice";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";

const buttonBase =
  "rounded-lg border px-4 py-3 text-sm font-medium capitalize transition-colors";
const buttonIdle =
  "border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800";
const buttonCorrect =
  "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-300";
const buttonWrong =
  "border-red-500 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-950 dark:text-red-300";
const buttonMuted =
  "border-zinc-200 text-zinc-400 dark:border-zinc-800 dark:text-zinc-600";

export default function PracticePage() {
  const { cards, recordAnswer } = useFlashcards();
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<Article | null>(null);

  // Rebuilds only when the round counter changes (explicit restart) or once
  // cards first become available after localStorage hydrates — not on every
  // card mutation (e.g. answering shouldn't reshuffle the current round).
  const hasCards = cards.length > 0;
  const order = useMemo(
    () => (hasCards ? buildPracticeOrder(cards) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [round, hasCards],
  );

  // Skip past any id whose card was deleted mid-round, computed at render
  // time rather than stored, so there's nothing to keep in sync.
  let effectiveIndex = index;
  while (
    order &&
    effectiveIndex < order.length &&
    !cards.some((c) => c.id === order[effectiveIndex])
  ) {
    effectiveIndex++;
  }

  function restart() {
    setRound((r) => r + 1);
    setIndex(0);
    setChosen(null);
  }

  if (cards.length === 0) {
    return (
      <EmptyState
        title="Nothing to practice yet"
        description="Add a few flashcards first, then come back here to play."
        actionHref="/cards/new"
        actionLabel="Add a flashcard"
      />
    );
  }

  if (!order || effectiveIndex >= order.length) {
    const learned = cards.filter((c) => getFlashcardStatus(c) === "learned").length;
    const needsPractice = cards.filter(
      (c) => getFlashcardStatus(c) === "needs-practice",
    ).length;
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-zinc-200 p-8 text-center dark:border-zinc-800">
        <h1 className="text-xl font-semibold">Round complete!</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {learned} learned, {needsPractice} still need practice.
        </p>
        <button
          type="button"
          onClick={restart}
          className="inline-flex items-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Play again
        </button>
      </div>
    );
  }

  const card = cards.find((c) => c.id === order[effectiveIndex])!;

  function choose(article: Article) {
    if (chosen) return;
    setChosen(article);
    recordAnswer(card.id, article === card.article);
  }

  function next() {
    setIndex(effectiveIndex + 1);
    setChosen(null);
  }

  const isCorrect = chosen === card.article;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
        <span>
          Card {effectiveIndex + 1} of {order.length}
        </span>
        <button
          type="button"
          onClick={restart}
          className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          Restart
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 p-10 text-center dark:border-zinc-800">
        <p className="text-3xl font-semibold">{card.noun}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {ARTICLES.map((article) => {
          const isCorrectAnswer = article === card.article;
          const isChosen = chosen === article;
          let style = buttonIdle;
          if (chosen) {
            if (isCorrectAnswer) style = buttonCorrect;
            else if (isChosen) style = buttonWrong;
            else style = buttonMuted;
          }
          return (
            <button
              key={article}
              type="button"
              disabled={!!chosen}
              onClick={() => choose(article)}
              className={`${buttonBase} ${style}`}
            >
              {article}
            </button>
          );
        })}
      </div>

      {chosen && (
        <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <div className="flex items-center justify-between gap-3">
            <p
              className={`font-medium ${
                isCorrect
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {isCorrect
                ? "Correct!"
                : `Not quite — the answer is ${card.article} ${card.noun}.`}
            </p>
            <StatusBadge status={getFlashcardStatus(card)} />
          </div>
          <div>
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Rule
            </h2>
            <p className="mt-1 text-sm">{card.rule}</p>
          </div>
          {card.exception && (
            <div>
              <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Exception
              </h2>
              <p className="mt-1 text-sm">{card.exception}</p>
            </div>
          )}
          <button
            type="button"
            onClick={next}
            className="self-start rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Next word →
          </button>
        </div>
      )}
    </div>
  );
}
