"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useFlashcards } from "@/lib/flashcards/context";
import { ARTICLES, getFlashcardStatus, type Article } from "@/lib/flashcards/types";
import { buildPracticeOrder, ROUND_SIZE } from "@/lib/flashcards/practice";
import { formatRuleText } from "@/lib/flashcards/ruleFormatting";
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

interface SessionScore {
  correct: number;
  total: number;
}

export default function Home() {
  const { cards, recordAnswer } = useFlashcards();
  const [round, setRound] = useState(0);
  const [redoQueue, setRedoQueue] = useState<string[] | null>(null);
  const [wrongThisPass, setWrongThisPass] = useState<string[]>([]);
  const [isRedo, setIsRedo] = useState(false);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<Article | null>(null);
  const [session, setSession] = useState<SessionScore>({ correct: 0, total: 0 });

  // Rebuilds only when the round counter changes (explicit restart) or once
  // cards first become available after localStorage hydrates — not on every
  // card mutation (e.g. answering shouldn't reshuffle the current round).
  const hasCards = cards.length > 0;
  const baseOrder = useMemo(
    () => (hasCards ? buildPracticeOrder(cards) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [round, hasCards],
  );
  // A redo queue (the cards missed in the previous pass) overrides the base
  // round until it's cleared by starting a fresh round.
  const queue = redoQueue ?? baseOrder;

  // Skip past any id whose card was deleted mid-round, computed at render
  // time rather than stored, so there's nothing to keep in sync.
  let effectiveIndex = index;
  while (
    queue &&
    effectiveIndex < queue.length &&
    !cards.some((c) => c.id === queue[effectiveIndex])
  ) {
    effectiveIndex++;
  }

  function nextRound() {
    setRound((r) => r + 1);
    setRedoQueue(null);
    setWrongThisPass([]);
    setIsRedo(false);
    setIndex(0);
    setChosen(null);
  }

  function choose(article: Article, cardId: string, correctArticle: Article) {
    if (chosen) return;
    setChosen(article);
    const wasCorrect = article === correctArticle;
    recordAnswer(cardId, wasCorrect);
    setSession((s) => ({
      correct: s.correct + (wasCorrect ? 1 : 0),
      total: s.total + 1,
    }));
    if (!wasCorrect) {
      setWrongThisPass((prev) => [...prev, cardId]);
    }
  }

  function advance() {
    const newIndex = effectiveIndex + 1;
    // Pass finished (last card just answered) — if anything was missed,
    // loop straight into a redo pass of just those cards instead of ending.
    if (queue && newIndex >= queue.length && wrongThisPass.length > 0) {
      setRedoQueue(wrongThisPass);
      setWrongThisPass([]);
      setIndex(0);
      setIsRedo(true);
    } else {
      setIndex(newIndex);
    }
    setChosen(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:items-start">
      <aside className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-semibold">der · die · das</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Learn German noun articles and the rules behind them.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <h2 className="text-sm font-semibold">How to use</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs text-zinc-600 dark:text-zinc-400">
            <li>Guess der, die, or das, then click the card to flip it.</li>
            <li>
              Get one wrong and it comes back at the end of the round for
              another try.
            </li>
            <li>
              {ROUND_SIZE} cards per round, score keeps counting. Full
              reference: <Link href="/rules" className="underline underline-offset-2">The Rules</Link>.
            </li>
          </ul>
        </div>

        <Link
          href="/cards"
          className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Add your own cards
        </Link>
      </aside>

      <div>
        {cards.length === 0 ? (
          <EmptyState
            title="No flashcards yet"
            description="Your deck is empty — add a noun to start practicing."
            actionHref="/cards/new"
            actionLabel="Add a flashcard"
          />
        ) : !queue || effectiveIndex >= queue.length ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-zinc-200 p-8 text-center dark:border-zinc-800">
            <h2 className="text-xl font-semibold">Round complete!</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Score so far: {session.correct}/{session.total}
              {session.total > 0 &&
                ` (${Math.round((session.correct / session.total) * 100)}%)`}
            </p>
            <button
              type="button"
              onClick={nextRound}
              className="inline-flex items-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              Next {ROUND_SIZE} words →
            </button>
          </div>
        ) : (
          <Game
            cardId={queue[effectiveIndex]}
            positionLabel={
              isRedo
                ? `Redo ${effectiveIndex + 1} of ${queue.length}`
                : `Card ${effectiveIndex + 1} of ${queue.length}`
            }
            scoreLabel={`Score ${session.correct}/${session.total}`}
            chosen={chosen}
            onRestart={nextRound}
            onChoose={choose}
            onAdvance={advance}
          />
        )}
      </div>
    </div>
  );
}

function Game({
  cardId,
  positionLabel,
  scoreLabel,
  chosen,
  onRestart,
  onChoose,
  onAdvance,
}: {
  cardId: string;
  positionLabel: string;
  scoreLabel: string;
  chosen: Article | null;
  onRestart: () => void;
  onChoose: (article: Article, cardId: string, correctArticle: Article) => void;
  onAdvance: () => void;
}) {
  const { cards } = useFlashcards();
  const card = cards.find((c) => c.id === cardId);
  if (!card) return null;

  const isCorrect = chosen === card.article;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
        <span>{positionLabel}</span>
        <span>{scoreLabel}</span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRestart();
          }}
          className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          Restart
        </button>
      </div>

      <div
        onClick={() => {
          if (chosen) onAdvance();
        }}
        className={`flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-zinc-200 p-8 text-center dark:border-zinc-800 ${
          chosen ? "cursor-pointer" : ""
        }`}
      >
        <p className="text-3xl font-semibold">{card.noun}</p>

        <div className="mt-8 grid w-full max-w-sm grid-cols-3 gap-3">
          {ARTICLES.map((article) => {
            if (!chosen) {
              return (
                <button
                  key={article}
                  type="button"
                  onClick={() => onChoose(article, card.id, card.article)}
                  className={`${buttonBase} ${buttonIdle}`}
                >
                  {article}
                </button>
              );
            }
            const isCorrectAnswer = article === card.article;
            const isWrongChoice = chosen === article && !isCorrectAnswer;
            let style = buttonMuted;
            if (isCorrectAnswer) style = buttonCorrect;
            else if (isWrongChoice) style = buttonWrong;
            return (
              <div key={article} className={`${buttonBase} ${style}`}>
                {article}
              </div>
            );
          })}
        </div>

        {chosen && (
          <div className="mt-6 flex w-full flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <p
                className={`text-sm font-medium ${
                  isCorrect
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {isCorrect ? "Correct!" : "Not quite."}
              </p>
              <StatusBadge status={getFlashcardStatus(card)} />
            </div>

            <div className="text-left">
              <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Rule
              </h2>
              <p className="mt-1 text-sm">{formatRuleText(card.rule)}</p>
            </div>

            {card.exception && (
              <div className="text-left">
                <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Exception
                </h2>
                <p className="mt-1 text-sm">{formatRuleText(card.exception)}</p>
              </div>
            )}

            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Click anywhere to continue →
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
