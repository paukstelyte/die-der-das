# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

A learning game with flashcards that helps the user learn German noun articles (der/die/das) and understand the grammatical rules and exceptions behind them.


### Seed data (`lib/flashcards/data/`)

The deck ships pre-seeded with `seed.json` (~1,000 cards, currently 996), generated from the rule set in `rules.json` (also what powers the `/rules` page). Both were built via background research agents from real German grammar sources and a Wiktionary-derived noun+gender dataset, then the deck went through a CEFR-level audit against official Goethe-Institut A1/A2/B1 word lists plus manual review (confirmed 91%+ A1-B2; the rest is the most everyday word available within an inherently formal rule family, e.g. -tum/-ismus vocab) — don't reintroduce obscure/technical/off-tone words when adding or regenerating entries.

**Important**: the build script and raw source datasets (the 87k-entry noun+gender CSV, the frequency list, the CEFR word lists, the audit/replacement scripts) were never committed — they only ever existed in an ephemeral session scratchpad and are gone. `seed.json`/`rules.json` are the only durable output. Regenerating or meaningfully expanding the deck means re-sourcing data from scratch (e.g. a fresh Wiktionary-derived German noun+gender dataset), not looking for a pipeline in this repo.

### Card `origin` and the "New" status

Each `Flashcard` has `origin: "seed" | "user"`. `getFlashcardStatus` only reports `"new"` for `origin: "user"` cards; an unplayed seed/reference card reports `"unplayed"` instead (no badge shown for it) — this is deliberate, so the ~1,000-card reference deck never displays as "New". `buildPracticeOrder` prioritizes needs-practice → your new cards → unplayed reference cards → learned, so a freshly added card reliably lands in the very next deck instead of being diluted into the huge reference pool. `storage.ts` backfills `origin` on load for any card saved before this field existed (inferred from the `seed-N` id pattern) — don't remove that migration while old localStorage data might still be in use.

### Visual design

`app/globals.css` defines the design tokens (`--paper`, `--accent`, `--accent-deep`, `--ink-soft`, `--line`) for a fixed light "editorial/neo-brutalist" look (grid background, hard drop-shadows, Geist Sans). 

## Tech Stack (fixed)

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* LocalStorage for persistence

The app runs locally at `localhost:3000`. Do not swap any part of this stack.

## Webapp Requirements

* At least two pages, including one detail page with its own address/route.
* The user can create, edit, and delete flashcards (the nouns) — deletion works both from a card's detail page and directly from a row in the `/cards` list (with confirmation), so searching for a card and deleting it from the results works without opening the detail page.
* The deck ships pre-populated (~1,000 cards covering the rules and exceptions on `/rules`) — adding your own cards is optional, never required to start playing.
* A short description on how to use the app is shown 
* Data created by the user persists across a full page reload (LocalStorage).
* No blank screens: show a readable empty-state message when there is no data yet, and a friendly "not found" message for a route/address that doesn't exist.

## Flashcard Game Interaction Requirements

* Layout must be usable and responsive.
* The game plays in fixed-size rounds/decks (30 cards). At round end, the player can replay the previous mistakes or proceed to the next deck.
 A newly created card must be eligible for the very next round 
* The score shown during play and on the round-complete screen ("This deck: X/Y") is scoped to the current deck only and resets to 0/0 every new deck
* The Restart button gives a fresh deck AND resets the session-wide stats
Clicking anywhere on the flipped card advances to the next one.
* A flashcard is automatically classified as "already learned" or "still needs practice" after 2 correct or 2 incorrect answers in a row, and shown via a status badge — but this mechanic is not explained in the on-screen instructions (

* Flashcard answers show the grammar rule that explains why the answer is correct. Exceptions to rules are explained as well, not just the base rule.
* On both a flashcard's rule text and the `/rules` reference page, the specific suffix/prefix a rule hinges on (e.g. **-ung**, **Ge-**) is bolded wherever it appears in the explanation.

## Working Rules

- If instructions are unclear, ask for clarification — do not presume intent.
- Keep the design clean and conscise througout pages

## Do Not

* Install additional packages without asking first.
