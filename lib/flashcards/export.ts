import type { Flashcard } from "./types";

function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** CSV of every card — noun, article, and whether the user added it
 * themselves ("newly added") vs. it shipping with the reference deck. */
export function buildCardsCsv(cards: Flashcard[]): string {
  const header = ["Noun", "Article", "Newly added"];
  const rows = cards
    .slice()
    .sort((a, b) => a.noun.localeCompare(b.noun, "de"))
    .map((card) => [card.noun, card.article, card.origin === "user" ? "Yes" : "No"]);
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

export function downloadCardsCsv(cards: Flashcard[]) {
  downloadTextFile("die-der-das-cards.csv", buildCardsCsv(cards), "text/csv");
}
