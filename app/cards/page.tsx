"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useFlashcards } from "@/lib/flashcards/context";
import { getFlashcardStatus, type FlashcardStatus } from "@/lib/flashcards/types";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { downloadCardsCsv } from "@/lib/flashcards/export";
import { DownloadIcon } from "@/components/DownloadIcon";

const PAGE_SIZE = 150;

const STATUS_FILTERS: { value: FlashcardStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "needs-practice", label: "Needs practice" },
  { value: "learned", label: "Learned" },
];

export default function CardsPage() {
  const { cards, deleteCard } = useFlashcards();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<FlashcardStatus | "all">("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  function handleDelete(id: string, label: string) {
    if (window.confirm(`Delete "${label}"? This can't be undone.`)) {
      deleteCard(id);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards
      .filter((card) => {
        if (status !== "all" && getFlashcardStatus(card) !== status) return false;
        if (!q) return true;
        return (
          card.noun.toLowerCase().includes(q) || card.article.includes(q)
        );
      })
      .sort((a, b) => a.noun.localeCompare(b.noun, "de"));
  }, [cards, query, status]);

  const shown = filtered.slice(0, visible);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Manage cards</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => downloadCardsCsv(cards)}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <DownloadIcon />
            Export CSV
          </button>
          <Link
            href="/cards/new"
            className="inline-flex items-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Add flashcard
          </Link>
        </div>
      </div>

      {cards.length === 0 ? (
        <EmptyState
          title="No flashcards yet"
          description="Add a noun, its article, and the rule behind it to get started."
          actionHref="/cards/new"
          actionLabel="Add a flashcard"
        />
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Search nouns…"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-400 sm:max-w-xs"
            />
            <div className="flex flex-wrap gap-1.5">
              {STATUS_FILTERS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setStatus(option.value);
                    setVisible(PAGE_SIZE);
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    status === option.value
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "border border-zinc-300 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {filtered.length} of {cards.length} card
            {cards.length === 1 ? "" : "s"}
          </p>

          {filtered.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No cards match “{query}”.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {shown.map((card) => (
                <li
                  key={card.id}
                  className="flex items-center gap-1 rounded-lg border border-zinc-200 pl-4 pr-2 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  <Link
                    href={`/cards/${card.id}`}
                    className="flex flex-1 items-center justify-between gap-3 py-3"
                  >
                    <span>
                      <span className="font-medium capitalize">
                        {card.article}
                      </span>{" "}
                      {card.noun}
                    </span>
                    <StatusBadge status={getFlashcardStatus(card)} />
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(card.id, `${card.article} ${card.noun}`)
                    }
                    aria-label={`Delete ${card.article} ${card.noun}`}
                    title="Delete"
                    className="shrink-0 rounded-full p-2 text-zinc-400 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                      <path d="M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {filtered.length > shown.length && (
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="self-center rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Show more ({filtered.length - shown.length} remaining)
            </button>
          )}
        </>
      )}
    </div>
  );
}
