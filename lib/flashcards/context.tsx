"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import type { Flashcard, FlashcardInput } from "./types";
import { generateId } from "./storage";
import { getServerSnapshot, getSnapshot, setCards, subscribe } from "./store";

interface FlashcardsContextValue {
  cards: Flashcard[];
  addCard: (input: FlashcardInput) => Flashcard;
  updateCard: (id: string, input: FlashcardInput) => void;
  deleteCard: (id: string) => void;
  recordAnswer: (id: string, wasCorrect: boolean) => void;
}

const FlashcardsContext = createContext<FlashcardsContextValue | null>(null);

export function FlashcardsProvider({ children }: { children: ReactNode }) {
  const cards = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo<FlashcardsContextValue>(
    () => ({
      cards,
      addCard: (input) => {
        const now = new Date().toISOString();
        const card: Flashcard = {
          id: generateId(),
          noun: input.noun,
          article: input.article,
          rule: input.rule,
          exception: input.exception,
          origin: "user",
          incorrectStreak: 0,
          createdAt: now,
          updatedAt: now,
        };
        setCards((prev) => [...prev, card]);
        return card;
      },
      updateCard: (id, input) => {
        setCards((prev) =>
          prev.map((card) =>
            card.id === id
              ? { ...card, ...input, updatedAt: new Date().toISOString() }
              : card,
          ),
        );
      },
      deleteCard: (id) => {
        setCards((prev) => prev.filter((card) => card.id !== id));
      },
      recordAnswer: (id, wasCorrect) => {
        setCards((prev) =>
          prev.map((card) =>
            card.id === id
              ? {
                  ...card,
                  incorrectStreak: wasCorrect ? 0 : card.incorrectStreak + 1,
                  updatedAt: new Date().toISOString(),
                }
              : card,
          ),
        );
      },
    }),
    [cards],
  );

  return (
    <FlashcardsContext.Provider value={value}>
      {children}
    </FlashcardsContext.Provider>
  );
}

export function useFlashcards() {
  const ctx = useContext(FlashcardsContext);
  if (!ctx) {
    throw new Error("useFlashcards must be used within a FlashcardsProvider");
  }
  return ctx;
}
