"use client";

import { useState, type FormEvent } from "react";
import { ARTICLES, type Article, type FlashcardInput } from "@/lib/flashcards/types";

const inputClasses =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-400";

export function FlashcardForm({
  initialValues,
  submitLabel,
  onSubmit,
}: {
  initialValues?: FlashcardInput;
  submitLabel: string;
  onSubmit: (input: FlashcardInput) => void;
}) {
  const [noun, setNoun] = useState(initialValues?.noun ?? "");
  const [article, setArticle] = useState<Article>(
    initialValues?.article ?? "der",
  );
  const [rule, setRule] = useState(initialValues?.rule ?? "");
  const [exception, setException] = useState(initialValues?.exception ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!noun.trim() || !rule.trim()) {
      setError("Noun and rule are both required.");
      return;
    }
    setError(null);
    onSubmit({
      noun: noun.trim(),
      article,
      rule: rule.trim(),
      exception: exception.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="noun" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Noun
        </label>
        <input
          id="noun"
          value={noun}
          onChange={(event) => setNoun(event.target.value)}
          placeholder="e.g. Tisch"
          className={inputClasses}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Article
        </span>
        <div className="flex gap-2">
          {ARTICLES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setArticle(option)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                article === option
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="rule" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Rule
        </label>
        <textarea
          id="rule"
          value={rule}
          onChange={(event) => setRule(event.target.value)}
          placeholder="e.g. Nouns ending in -tion are feminine."
          rows={3}
          className={inputClasses}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="exception" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Exception <span className="font-normal text-zinc-500">(optional)</span>
        </label>
        <textarea
          id="exception"
          value={exception}
          onChange={(event) => setException(event.target.value)}
          placeholder="e.g. Explain why this word breaks the usual pattern, if it does."
          rows={2}
          className={inputClasses}
        />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        className="self-start rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {submitLabel}
      </button>
    </form>
  );
}
