"use client";

import { useRouter } from "next/navigation";
import { useFlashcards } from "@/lib/flashcards/context";
import { FlashcardForm } from "@/components/FlashcardForm";
import type { FlashcardInput } from "@/lib/flashcards/types";

export default function NewCardPage() {
  const router = useRouter();
  const { addCard } = useFlashcards();

  function handleSubmit(input: FlashcardInput) {
    const card = addCard(input);
    router.push(`/cards/${card.id}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Add a flashcard</h1>
      <FlashcardForm submitLabel="Add flashcard" onSubmit={handleSubmit} />
    </div>
  );
}
