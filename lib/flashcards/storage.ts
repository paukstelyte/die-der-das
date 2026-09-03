import type { Flashcard } from "./types";
import seedCards from "./data/seed.json";

const STORAGE_KEY = "die-der-das:flashcards";

interface SeedCard {
  noun: string;
  article: Flashcard["article"];
  rule: string;
  exception: string;
}

/** Builds the pre-prepared starter deck. Called only the very first time the
 * app runs on a device (no localStorage key yet) — once saved, the user's
 * own deck (including any deletions) takes over. */
function buildSeedDeck(): Flashcard[] {
  const now = new Date().toISOString();
  return (seedCards as SeedCard[]).map((card, index) => ({
    id: `seed-${index}`,
    noun: card.noun,
    article: card.article,
    rule: card.rule,
    exception: card.exception,
    origin: "seed",
    correctStreak: 0,
    incorrectStreak: 0,
    createdAt: now,
    updatedAt: now,
  }));
}

/** Backfills `origin` on cards saved before that field existed, inferring it
 * from the deterministic `seed-N` id the pre-built deck uses. */
function withOrigin(card: Flashcard): Flashcard {
  if (card.origin) return card;
  return { ...card, origin: card.id.startsWith("seed-") ? "seed" : "user" };
}

export function loadFlashcards(): Flashcard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      const seeded = buildSeedDeck();
      saveFlashcards(seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(withOrigin) : [];
  } catch {
    return [];
  }
}

export function saveFlashcards(cards: Flashcard[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch {
    // Storage may be full or blocked (e.g. private browsing); the
    // app still works for the rest of this session.
  }
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
