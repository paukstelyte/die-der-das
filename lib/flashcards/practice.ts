import { getFlashcardStatus, type Flashcard } from "./types";

export function shuffle<T>(list: T[]): T[] {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const ROUND_SIZE = 30;

/** Needs-practice cards first, then cards the user added themselves (so a
 * newly added card surfaces in the very next deck instead of being diluted
 * among the ~1,000 unplayed reference cards), then the rest of the unplayed
 * reference deck — each group shuffled — trimmed down to one round's worth
 * of cards. */
export function buildPracticeOrder(
  cards: Flashcard[],
  roundSize: number = ROUND_SIZE,
): string[] {
  const needsPractice = cards.filter(
    (c) => getFlashcardStatus(c) === "needs-practice",
  );
  const isNew = cards.filter((c) => getFlashcardStatus(c) === "new");
  const unplayed = cards.filter((c) => getFlashcardStatus(c) === "unplayed");
  return [...shuffle(needsPractice), ...shuffle(isNew), ...shuffle(unplayed)]
    .slice(0, roundSize)
    .map((c) => c.id);
}
