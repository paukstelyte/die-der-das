# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

A learning game with flashcards that helps the user learn German noun articles (der/die/das) and understand the grammatical rules and exceptions behind them.

The app's own display name/title is styled **die·der·das** (that word order, not der·die·das) — keep this order in UI branding (nav logo, page titles). This is just the app's stylized name; prose that explains the grammar itself still uses the standard der/die/das (masculine/feminine/neuter) convention.

## Status

Built. Pages: `/` (home — the practice game), `/rules` (rule reference), `/cards` (manage/search cards), `/cards/new`, `/cards/[id]` (detail/edit/delete).

The deck ships pre-seeded with `lib/flashcards/data/seed.json` (~1,000 cards), generated from the rule set in `lib/flashcards/data/rules.json` (also what powers the `/rules` page). Both were built from researched German grammar sources and a verified noun+gender dataset — see git history on `lib/flashcards/data/` before regenerating either file from scratch. The deck has also been through a CEFR-level curation pass (91%+ A1-B2, rest deliberately picked as the most everyday word available within an inherently formal rule family) — don't reintroduce obscure/technical/off-tone words when adding or regenerating entries; keep new additions at a comparable level.

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
* The user can create, edit, and delete flashcards (the nouns).
* The deck ships pre-populated (~1,000 cards covering the rules and exceptions on `/rules`) — adding your own cards is optional, never required to start playing.
* A short description on how to use the app is shown somewhere in the UI.
* Data created by the user persists across a full page reload (LocalStorage).
* No blank screens: show a readable empty-state message when there is no data yet, and a friendly "not found" message for a route/address that doesn't exist.

## Flashcard Game Interaction Requirements

* Layout must be usable and responsive.
* The game plays in fixed-size rounds/decks (30 cards) that always end after exactly 30, regardless of mistakes. At round end, the player gets an explicit, optional choice: "Learn from your mistakes" (a recap pass of just the cards missed that round — recap also ends after those cards and offers the same choice again if any are still missed) or "Next N words" (skip the recap, start a fresh deck). Never auto-loop into a recap. A newly created card must be eligible for the very next round (this already falls out of rebuilding the round from the live card list whenever a new round starts — don't cache/snapshot the card list at round start in a way that would exclude it).
* The score shown during play and on the round-complete screen ("This deck: X/Y") is scoped to the current deck only and resets to 0/0 every new deck — it is not a running session total. Recap-pass answers don't count toward it.
* The Restart button gives a fresh deck AND resets the session-wide stats below (see next bullet); finishing a deck normally via "Next N words" only resets the per-deck score and leaves the session-wide stats accumulating.
* The bottom of the home page shows session-wide stats: **Decks played** (increments once per completed base deck, not per recap pass), **Mistakes learned** (a card missed in a base round that was subsequently answered correctly during a recap pass), and **Overall accuracy %** (computed from base-deck answers only, explicitly excluding recap-pass answers).
* Each card is a flip, not a multi-step form: the front shows the noun and the der/die/das buttons; picking one flips the same box in place to reveal the correct answer (highlighted green, with a wrong pick highlighted red) plus the rule and any exception — no separate reveal panel below it, no "next" button. Clicking anywhere on the flipped card advances to the next one.
* A flashcard is automatically classified as "already learned" or "still needs practice" after 2 correct or 2 incorrect answers in a row, and shown via a status badge — but this mechanic is not explained in the on-screen instructions (kept out of the "how to use" copy intentionally).
* Flashcard answers show the grammar rule that explains why the answer is correct. Exceptions to rules are explained as well, not just the base rule.
* On both a flashcard's rule text and the `/rules` reference page, the specific suffix/prefix a rule hinges on (e.g. **-ung**, **Ge-**) is bolded wherever it appears in the explanation.

## Working Rules

* If instructions are unclear, ask for clarification — do not presume intent.
* Keep the design clean.

## Do Not

* Install additional packages without asking first.
