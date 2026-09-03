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

interface RoundScore {
  correct: number;
  total: number;
}

export default function Home() {
  const { cards, recordAnswer } = useFlashcards();
  const [round, setRound] = useState(0);
  const [recapQueue, setRecapQueue] = useState<string[] | null>(null);
  const [wrongThisPass, setWrongThisPass] = useState<string[]>([]);
  const [isRecap, setIsRecap] = useState(false);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<Article | null>(null);
  // Score for the current deck only — resets every new deck. Recap answers
  // don't count toward it, since a recap isn't itself "a deck of 30".
  const [deckScore, setDeckScore] = useState<RoundScore>({ correct: 0, total: 0 });
  // Session-wide stats shown at the bottom of the page — persist across
  // decks and are only reset by the Restart button.
  const [decksPlayed, setDecksPlayed] = useState(0);
  const [mistakesLearned, setMistakesLearned] = useState(0);
  // Accuracy tracked from base-round answers only, excluding "learn from
  // your mistakes" recap passes.
  const [baseStats, setBaseStats] = useState<RoundScore>({ correct: 0, total: 0 });

  // Rebuilds only when the round counter changes (explicit restart, or
  // "Next N words") or once cards first become available after localStorage
  // hydrates — not on every card mutation (e.g. answering shouldn't reshuffle
  // the current round). Any card added since the last rebuild is picked up
  // automatically, since this always reads the live `cards` array.
  const hasCards = cards.length > 0;
  const baseOrder = useMemo(
    () => (hasCards ? buildPracticeOrder(cards) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [round, hasCards],
  );
  // An optional recap queue (the cards missed last round) overrides the base
  // round until it's cleared by starting a fresh round.
  const queue = recapQueue ?? baseOrder;

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

  function startFreshDeck() {
    setRound((r) => r + 1);
    setRecapQueue(null);
    setWrongThisPass([]);
    setIsRecap(false);
    setIndex(0);
    setChosen(null);
    setDeckScore({ correct: 0, total: 0 });
  }

  /** "Next N words" — starts a fresh deck, session-wide stats keep counting. */
  function nextRound() {
    startFreshDeck();
  }

  /** The Restart button — starts a fresh deck AND resets the session-wide
   * stats shown at the bottom of the page. */
  function restart() {
    startFreshDeck();
    setDecksPlayed(0);
    setMistakesLearned(0);
    setBaseStats({ correct: 0, total: 0 });
  }

  function startRecap() {
    setRecapQueue(wrongThisPass);
    setWrongThisPass([]);
    setIsRecap(true);
    setIndex(0);
    setChosen(null);
  }

  function choose(article: Article, cardId: string, correctArticle: Article) {
    if (chosen) return;
    setChosen(article);
    const wasCorrect = article === correctArticle;
    recordAnswer(cardId, wasCorrect);
    if (isRecap) {
      if (wasCorrect) setMistakesLearned((m) => m + 1);
    } else {
      setDeckScore((s) => ({
        correct: s.correct + (wasCorrect ? 1 : 0),
        total: s.total + 1,
      }));
      setBaseStats((s) => ({
        correct: s.correct + (wasCorrect ? 1 : 0),
        total: s.total + 1,
      }));
    }
    if (!wasCorrect) {
      setWrongThisPass((prev) => [...prev, cardId]);
    }
  }

  function advance() {
    const newIndex = effectiveIndex + 1;
    if (queue && newIndex >= queue.length && !isRecap) {
      setDecksPlayed((d) => d + 1);
    }
    setIndex(newIndex);
    setChosen(null);
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:items-start">
      <aside className="flex flex-col gap-5 lg:pt-3">
        <div>
          <div className="mb-5 h-2 w-12 bg-[var(--accent)]" />
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">German article practice / 01</p>
          <h1 className="mt-3 text-4xl font-bold leading-none tracking-[-0.06em] sm:text-5xl">die · der · das</h1>
          <p className="mt-4 text-sm leading-6 text-zinc-600">
            Learn German noun articles and the rules behind them.
          </p>
        </div>

        <div className="border-t border-black/15 pt-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">How to use</h2>
          <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-zinc-600">
            <li>Guess der, die, or das, then click the card to flip it.</li>
            <li>
              After {ROUND_SIZE} cards, choose to learn from your mistakes or
              jump to the next deck. Score keeps counting.
            </li>
            <li>
              Full reference: <Link href="/rules" className="underline underline-offset-2">The Rules</Link>.
            </li>
          </ul>
        </div>

        <Link
          href="/cards"
          className="inline-flex items-center justify-center self-start border-b border-zinc-900 pb-1 text-sm font-medium text-zinc-900 transition-colors hover:border-[var(--accent-deep)] hover:text-[var(--accent-deep)]"
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
          <div className="flex flex-col items-center justify-center gap-4 border border-black/15 bg-[var(--paper)] p-8 text-center shadow-[8px_8px_0_var(--accent)]">
            <h2 className="text-xl font-semibold">
              {isRecap ? "Recap complete!" : "Round complete!"}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              This deck: {deckScore.correct}/{deckScore.total}
              {deckScore.total > 0 &&
                ` (${Math.round((deckScore.correct / deckScore.total) * 100)}%)`}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {wrongThisPass.length > 0 && (
                <button
                  type="button"
                  onClick={startRecap}
                  className="inline-flex items-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                >
                  Learn from your mistakes ({wrongThisPass.length})
                </button>
              )}
              <button
                type="button"
                onClick={nextRound}
                className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                  wrongThisPass.length > 0
                    ? "border border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                }`}
              >
                Next {ROUND_SIZE} words →
              </button>
            </div>
          </div>
        ) : (
          <Game
            cardId={queue[effectiveIndex]}
            positionLabel={
              isRecap
                ? `Recap ${effectiveIndex + 1} of ${queue.length}`
                : `Card ${effectiveIndex + 1} of ${queue.length}`
            }
            scoreLabel={`Score ${deckScore.correct}/${deckScore.total}`}
            chosen={chosen}
            onRestart={restart}
            onChoose={choose}
            onAdvance={advance}
          />
        )}
      </div>
      </div>

      <section className="grid grid-cols-3 gap-px border border-black/15 bg-black/15">
        <Stat label="Decks played" value={decksPlayed} />
        <Stat label="Mistakes learned" value={mistakesLearned} />
        <Stat
          label="Overall accuracy"
          value={
            baseStats.total > 0
              ? `${Math.round((baseStats.correct / baseStats.total) * 100)}%`
              : "—"
          }
        />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-[var(--paper)] p-4 text-center">
      <div className="text-2xl font-semibold tracking-[-0.04em]">{value}</div>
      <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">{label}</div>
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
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">
        <span>{positionLabel}</span>
        <span>{scoreLabel}</span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRestart();
          }}
          className="border-b border-zinc-400 pb-0.5 hover:border-zinc-900 hover:text-zinc-900"
        >
          Restart
        </button>
      </div>

      <div
        onClick={() => {
          if (chosen) onAdvance();
        }}
        className={`relative flex min-h-[380px] flex-col items-center justify-center overflow-hidden border border-black/15 bg-[var(--paper)] p-8 text-center shadow-[8px_8px_0_var(--accent)] sm:p-12 ${
          chosen ? "cursor-pointer" : ""
        }`}
      >
        <span className="absolute right-5 top-5 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400">noun / article</span>
        <span className="absolute bottom-5 left-5 h-5 w-5 border-b border-l border-black/30" />
        <p className="text-4xl font-bold tracking-[-0.06em] sm:text-5xl">{card.noun}</p>

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
