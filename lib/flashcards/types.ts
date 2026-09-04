export type Article = "der" | "die" | "das";

export const ARTICLES: Article[] = ["der", "die", "das"];

/** "seed" = part of the pre-built reference deck; "user" = added via the app. */
export type FlashcardOrigin = "seed" | "user";

export type FlashcardStatus = "new" | "needs-practice" | "unplayed";

export interface Flashcard {
  id: string;
  noun: string;
  article: Article;
  rule: string;
  exception: string;
  origin: FlashcardOrigin;
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

/** "New" is reserved for cards the user added themselves — the pre-built
 * reference deck shows as "unplayed" instead so it isn't mislabeled as new. */
export function getFlashcardStatus(card: Flashcard): FlashcardStatus {
  if (card.incorrectStreak >= STREAK_TO_CLASSIFY) return "needs-practice";
  return (card.origin ?? "seed") === "user" ? "new" : "unplayed";
}
