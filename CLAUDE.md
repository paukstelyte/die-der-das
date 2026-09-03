# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

A learning game with flashcards that helps the user learn German noun articles (der/die/das) and understand the grammatical rules and exceptions behind them.

## Status

Scaffolded with `create-next-app` (App Router, TypeScript, Tailwind, ESLint, no `src/` dir). No app features implemented yet.

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
* A short description on how to use the app is shown somewhere in the UI.
* Data created by the user persists across a full page reload (LocalStorage).
* No blank screens: show a readable empty-state message when there is no data yet, and a friendly "not found" message for a route/address that doesn't exist.

## Flashcard Game Interaction Requirements

* Layout must be usable and responsive.
* A flashcard is automatically classified as "already learned" or "still needs practice" after 2 correct or 2 incorrect answers.
* Flashcard answers show the grammar rule that explains why the answer is correct.
* Exceptions to rules are explained as well, not just the base rule.

## Working Rules

* If instructions are unclear, ask for clarification — do not presume intent.
* Keep the design clean.

## Do Not

* Install additional packages without asking first.
* Deploy the app or add/generate a URL for it.
