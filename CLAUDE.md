# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A learning game with flashcards that helps the user learn German noun articles (der/die/das) and understand the grammatical rules and exceptions behind them.


### Seed data (`lib/flashcards/data/`) (automated, haven't edited)

The deck ships pre-seeded with `seed.json` (~1,000 cards, currently 996), generated from the rule set in `rules.json` (also what powers the `/rules` page). Both were built via background research agents from real German grammar sources and a Wiktionary-derived noun+gender dataset, then the deck went through a CEFR-level audit against official Goethe-Institut A1/A2/B1 word lists plus manual review (confirmed 91%+ A1-B2; the rest is the most everyday word available within an inherently formal rule family, e.g. -tum/-ismus vocab) — don't reintroduce obscure/technical/off-tone words when adding or regenerating entries.

**Important**: the build script and raw source datasets (the 87k-entry noun+gender CSV, the frequency list, the CEFR word lists, the audit/replacement scripts) were never committed — they only ever existed in an ephemeral session scratchpad and are gone. `seed.json`/`rules.json` are the only durable output. Regenerating or meaningfully expanding the deck means re-sourcing data from scratch (e.g. a fresh Wiktionary-derived German noun+gender dataset), not looking for a pipeline in this repo.

### Card `origin` and the "New" status (automated, haven't edited)

Each `Flashcard` has `origin: "seed" | "user"`. `getFlashcardStatus` only reports `"new"` for `origin: "user"` cards; an unplayed seed/reference card reports `"unplayed"` instead (no badge shown for it) — this is deliberate, so the ~1,000-card reference deck never displays as "New". `buildPracticeOrder` prioritizes needs-practice → your new cards → unplayed reference cards, so a freshly added card reliably lands in the very next deck instead of being diluted into the huge reference pool. `storage.ts` backfills `origin` on load for any card saved before this field existed (inferred from the `seed-N` id pattern) — don't remove that migration while old localStorage data might still be in use.

### Visual design

`app/globals.css` defines the design tokens (`--paper`, `--accent`, `--accent-deep`, `--ink-soft`, `--line`) for a fixed light "editorial/neo-brutalist" look (grid background, hard drop-shadows, Geist Sans). 

## Tech Stack (fixed)

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* LocalStorage for persistence

## Run

The app runs locally at `localhost:3000`. Do not swap any part of this stack.

## General Requirements

* At least two pages, including one detail page with its own address/route.
* The user can create, edit, and delete flashcards (the nouns) — deletion works both from a card's detail page and directly from a row in the `/cards` list (with confirmation), so searching for a card and deleting it from the results works without opening the detail page.
* The deck ships pre-populated (~1,000 cards covering the rules and exceptions on `/rules`) — adding your own cards is optional, never required to start playing.
* A short description on how to use the app is shown 
* Data created by the user persists across a full page reload (LocalStorage).
* No blank screens: show a readable empty-state message when there is no data yet, and a friendly "not found" message for a route/address that doesn't exist.

## Flashcard Game Interaction Requirements

* Layout is responsive: sidebar + game panel on desktop, stacked on mobile.
* Rounds are fixed at 30 cards and always run to completion regardless of mistakes.
* At round end: "Learn from your mistakes (N)" (recap of just this round's misses, itself capped to those cards) or "Next 30 words" (fresh deck) — never auto-loops into recap.
* A newly added card is eligible for the very next round (the round rebuilds from the live card set each time).
* "This deck: X/Y" score is scoped to the current deck only and resets every new deck; recap answers don't count toward it.
* Restart gives a fresh deck and resets session-wide stats; "Next 30 words" only resets the per-deck score.
* Session-wide stats (bottom of home page): Decks played, Mistakes fixed (a base-round miss later answered correctly in recap), Overall accuracy % (base-deck answers only).
* Each card is a flip: the noun + der/die/das buttons on the front; picking one flips it in place (correct green, wrong red) to reveal the rule and any exception — no separate panel, no "next" button.
* Click anywhere on a flipped card to advance.
* A card is auto-flagged "needs practice" after 2 wrong answers in a row (shown as a badge) — not explained in the on-screen "how to use" copy.
* Every answer shows the grammar rule; exceptions are explained too, not just the base rule.
* The specific suffix/prefix a rule hinges on (e.g. **-ung**, **Ge-**) is bolded wherever it appears, on both the flashcard and the `/rules` page.

## Working Rules

- If instructions are unclear, ask me for clarification, don't make assumptions 
- Keep the design clean and conscise througout pages

## Do Not

* Install additional packages without asking first.
