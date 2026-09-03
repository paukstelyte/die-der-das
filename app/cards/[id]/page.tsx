"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFlashcards } from "@/lib/flashcards/context";
import { getFlashcardStatus, type FlashcardInput } from "@/lib/flashcards/types";
import { FlashcardForm } from "@/components/FlashcardForm";
import { StatusBadge } from "@/components/StatusBadge";

export default function CardDetailPage({
  params,
}: PageProps<"/cards/[id]">) {
  const { id } = use(params);
  const router = useRouter();
  const { cards, updateCard, deleteCard } = useFlashcards();
  const [isEditing, setIsEditing] = useState(false);

  const card = cards.find((c) => c.id === id);

  if (!card) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 px-6 py-12 text-center dark:border-zinc-700">
        <h1 className="text-lg font-semibold">Flashcard not found</h1>
        <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
          This flashcard doesn&apos;t exist — it may have been deleted, or the
          link is wrong.
        </p>
        <Link
          href="/cards"
          className="mt-2 inline-flex items-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Back to your cards
        </Link>
      </div>
    );
  }

  function handleUpdate(input: FlashcardInput) {
    updateCard(id, input);
    setIsEditing(false);
  }

  function handleDelete() {
    if (window.confirm(`Delete "${card!.noun}"? This can't be undone.`)) {
      deleteCard(id);
      router.push("/cards");
    }
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Edit flashcard</h1>
        <FlashcardForm
          initialValues={{
            noun: card.noun,
            article: card.article,
            rule: card.rule,
            exception: card.exception,
          }}
          submitLabel="Save changes"
          onSubmit={handleUpdate}
        />
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="self-start text-sm text-zinc-500 underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-semibold">
          <span className="capitalize">{card.article}</span> {card.noun}
        </h1>
        <StatusBadge status={getFlashcardStatus(card)} />
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <div>
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Rule
          </h2>
          <p className="mt-1">{card.rule}</p>
        </div>
        {card.exception && (
          <div>
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Exception
            </h2>
            <p className="mt-1">{card.exception}</p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
