export type Article = "der" | "die" | "das";

export const ARTICLES: Article[] = ["der", "die", "das"];

export type FlashcardStatus = "new" | "learned" | "needs-practice";

export interface Flashcard {
  id: string;
  noun: string;
  article: Article;
  rule: string;
  exception: string;
  correctStreak: number;
  incorrectStreak: number;
  createdAt: string;
  updatedAt: string;
}

export interface FlashcardInput {
  noun: string;
  article: Article;
  rule: string;
  exception: string;
}

export const STREAK_TO_CLASSIFY = 2;

export function getFlashcardStatus(card: Flashcard): FlashcardStatus {
  if (card.correctStreak >= STREAK_TO_CLASSIFY) return "learned";
  if (card.incorrectStreak >= STREAK_TO_CLASSIFY) return "needs-practice";
  return "new";
}
