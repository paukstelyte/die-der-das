# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

A learning game with flashcards that helps the user learn German noun articles (der/die/das) and understand the grammatical rules and exceptions behind them.

The app's own display name/title is styled **die·der·das** (that word order, not der·die·das) — keep this order in UI branding (nav logo, page titles). This is just the app's stylized name; prose that explains the grammar itself still uses the standard der/die/das (masculine/feminine/neuter) convention.

## Status

Built and working end to end. Pages: `/` (home — the practice game), `/rules` (rule reference), `/cards` (manage/search/delete cards), `/cards/new`, `/cards/[id]` (detail/edit/delete).

### Seed data (`lib/flashcards/data/`)

The deck ships pre-seeded with `seed.json` (~1,000 cards, currently 996), generated from the rule set in `rules.json` (also what powers the `/rules` page). Both were built via background research agents from real German grammar sources and a Wiktionary-derived noun+gender dataset, then the deck went through a CEFR-level audit against official Goethe-Institut A1/A2/B1 word lists plus manual review (confirmed 91%+ A1-B2; the rest is the most everyday word available within an inherently formal rule family, e.g. -tum/-ismus vocab) — don't reintroduce obscure/technical/off-tone words when adding or regenerating entries.

**Important**: the build script and raw source datasets (the 87k-entry noun+gender CSV, the frequency list, the CEFR word lists, the audit/replacement scripts) were never committed — they only ever existed in an ephemeral session scratchpad and are gone. `seed.json`/`rules.json` are the only durable output. Regenerating or meaningfully expanding the deck means re-sourcing data from scratch (e.g. a fresh Wiktionary-derived German noun+gender dataset), not looking for a pipeline in this repo.

### Card `origin` and the "New" status

Each `Flashcard` has `origin: "seed" | "user"`. `getFlashcardStatus` only reports `"new"` for `origin: "user"` cards; an unplayed seed/reference card reports `"unplayed"` instead (no badge shown for it) — this is deliberate, so the ~1,000-card reference deck never displays as "New". `buildPracticeOrder` prioritizes needs-practice → your new cards → unplayed reference cards → learned, so a freshly added card reliably lands in the very next deck instead of being diluted into the huge reference pool. `storage.ts` backfills `origin` on load for any card saved before this field existed (inferred from the `seed-N` id pattern) — don't remove that migration while old localStorage data might still be in use.

### Visual design

`app/globals.css` defines the design tokens (`--paper`, `--accent`, `--accent-deep`, `--ink-soft`, `--line`) for a fixed light "editorial/neo-brutalist" look (grid background, hard drop-shadows, Geist Sans). Dark-mode variables were intentionally removed in favor of this fixed aesthetic — most components (`app/page.tsx`, `NavBar`) were restyled to it; `app/cards/*` pages still use the earlier plain zinc/Tailwind-dark-mode styling and haven't been brought over to the new design system yet.

## Tech Stack (fixed)

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* LocalStorage for persistence

The app runs locally at `localhost:3000`. Do not swap any part of this stack.

## Commands

```
npm run dev      # start local dev server (localhost:3000)
npm run build    # production build
npm run lint     # lint
```

## Webapp Requirements

* At least two pages, including one detail page with its own address/route.
* The user can create, edit, and delete flashcards (the nouns) — deletion works both from a card's detail page and directly from a row in the `/cards` list (with confirmation), so searching for a card and deleting it from the results works without opening the detail page.
* The deck ships pre-populated (~1,000 cards covering the rules and exceptions on `/rules`) — adding your own cards is optional, never required to start playing.
* A short description on how to use the app is shown somewhere in the UI.
* Data created by the user persists across a full page reload (LocalStorage).
* No blank screens: show a readable empty-state message when there is no data yet, and a friendly "not found" message for a route/address that doesn't exist.

## Flashcard Game Interaction Requirements

* Layout must be usable and responsive.
* The game plays in fixed-size rounds/decks (30 cards) that always end after exactly 30, regardless of mistakes. At round end, the player gets an explicit, optional choice: "Learn from your mistakes" (a recap pass of just the cards missed that round — recap also ends after those cards and offers the same choice again if any are still missed) or "Next N words" (skip the recap, start a fresh deck). Never auto-loop into a recap. A newly created card must be eligible for the very next round (this already falls out of rebuilding the round from the live card list whenever a new round starts — don't cache/snapshot the card list at round start in a way that would exclude it).
* The score shown during play and on the round-complete screen ("This deck: X/Y") is scoped to the current deck only and resets to 0/0 every new deck — it is not a running session total. Recap-pass answers don't count toward it.
* The Restart button gives a fresh deck AND resets the session-wide stats below (see next bullet); finishing a deck normally via "Next N words" only resets the per-deck score and leaves the session-wide stats accumulating.
* The bottom of the home page shows session-wide stats: **Decks played** (increments once per completed base deck, not per recap pass), **Mistakes fixed** (a card missed in a base round that was subsequently answered correctly during a recap pass), and **Overall accuracy %** (computed from base-deck answers only, explicitly excluding recap-pass answers).
* Each card is a flip, not a multi-step form: the front shows the noun and the der/die/das buttons; picking one flips the same box in place to reveal the correct answer (highlighted green, with a wrong pick highlighted red) plus the rule and any exception — no separate reveal panel below it, no "next" button. Clicking anywhere on the flipped card advances to the next one.
* A flashcard is automatically classified as "already learned" or "still needs practice" after 2 correct or 2 incorrect answers in a row, and shown via a status badge — but this mechanic is not explained in the on-screen instructions (kept out of the "how to use" copy intentionally).
* Flashcard answers show the grammar rule that explains why the answer is correct. Exceptions to rules are explained as well, not just the base rule.
* On both a flashcard's rule text and the `/rules` reference page, the specific suffix/prefix a rule hinges on (e.g. **-ung**, **Ge-**) is bolded wherever it appears in the explanation.

## Working Rules

* If instructions are unclear, ask for clarification — do not presume intent.
* Keep the design clean.
* Only commit/push when explicitly asked. `main` is the working branch and is pushed to `origin` directly (repo: `paukstelyte/die-der-das`), no PR workflow — short-lived feature branches (e.g. `design`) get created on request, merged back into `main`, and deleted once fully merged.

## Do Not

* Install additional packages without asking first.
