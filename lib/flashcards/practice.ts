import { getFlashcardStatus, type Flashcard } from "./types";

export function shuffle<T>(list: T[]): T[] {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Needs-practice cards first, then new cards, then learned cards — each group shuffled. */
export function buildPracticeOrder(cards: Flashcard[]): string[] {
  const needsPractice = cards.filter(
    (c) => getFlashcardStatus(c) === "needs-practice",
  );
  const isNew = cards.filter((c) => getFlashcardStatus(c) === "new");
  const learned = cards.filter((c) => getFlashcardStatus(c) === "learned");
  return [...shuffle(needsPractice), ...shuffle(isNew), ...shuffle(learned)].map(
    (c) => c.id,
  );
}
