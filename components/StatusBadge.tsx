import type { FlashcardStatus } from "@/lib/flashcards/types";

type BadgeStatus = Exclude<FlashcardStatus, "unplayed">;

const LABELS: Record<BadgeStatus, string> = {
  new: "New",
  learned: "Learned",
  "needs-practice": "Needs practice",
};

const STYLES: Record<BadgeStatus, string> = {
  new: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  learned:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  "needs-practice":
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
};

export function StatusBadge({ status }: { status: FlashcardStatus }) {
  if (status === "unplayed") return null;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
