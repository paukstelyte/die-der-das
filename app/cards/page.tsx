"use client";

import Link from "next/link";
import { useFlashcards } from "@/lib/flashcards/context";
import { getFlashcardStatus } from "@/lib/flashcards/types";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";

export default function CardsPage() {
  const { cards } = useFlashcards();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage cards</h1>
        <Link
          href="/cards/new"
          className="inline-flex items-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Add flashcard
        </Link>
      </div>

      {cards.length === 0 ? (
        <EmptyState
          title="No flashcards yet"
          description="Add a noun, its article, and the rule behind it to get started."
          actionHref="/cards/new"
          actionLabel="Add a flashcard"
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {cards.map((card) => (
            <li key={card.id}>
              <Link
                href={`/cards/${card.id}`}
                className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                <span>
                  <span className="font-medium capitalize">
                    {card.article}
                  </span>{" "}
                  {card.noun}
                </span>
                <StatusBadge status={getFlashcardStatus(card)} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
