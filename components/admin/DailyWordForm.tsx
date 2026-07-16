"use client";

import { useActionState, useState } from "react";
import { BookOpen } from "lucide-react";
import { saveDailyWord } from "@/app/actions/admin";
import { initialFormState } from "@/lib/form-state";
import { field, label } from "@/lib/ui";
import { formatDate, todayInChicago } from "@/lib/format";
import type { DailyWord } from "@/lib/types";
import FormMessage from "@/components/forms/FormMessage";

/**
 * Daily Word editor with a live preview, so the pastor can see exactly
 * how the post will look before publishing.
 */
export default function DailyWordForm({ word }: { word?: DailyWord }) {
  const [state, formAction, pending] = useActionState(
    saveDailyWord,
    initialFormState
  );

  const [preview, setPreview] = useState({
    word_date: word?.word_date ?? todayInChicago(),
    scripture_reference: word?.scripture_reference ?? "",
    scripture_text: word?.scripture_text ?? "",
    title: word?.title ?? "",
    message: word?.message ?? "",
    prayer: word?.prayer ?? "",
  });

  function update(key: keyof typeof preview) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setPreview((p) => ({ ...p, [key]: e.target.value }));
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-2">
      <form action={formAction} className="space-y-5" noValidate>
        {word && <input type="hidden" name="id" value={word.id} />}

        <div>
          <label htmlFor="dw-date" className={label}>
            Date
          </label>
          <input
            id="dw-date"
            name="word_date"
            type="date"
            required
            value={preview.word_date}
            onChange={update("word_date")}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="dw-ref" className={label}>
            Scripture reference
          </label>
          <input
            id="dw-ref"
            name="scripture_reference"
            type="text"
            required
            placeholder="Example: 1 Corinthians 16:14"
            value={preview.scripture_reference}
            onChange={update("scripture_reference")}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="dw-text" className={label}>
            Scripture text
          </label>
          <textarea
            id="dw-text"
            name="scripture_text"
            rows={3}
            required
            placeholder="Type the verse exactly as it appears in your Bible."
            value={preview.scripture_text}
            onChange={update("scripture_text")}
            className={field}
          />
          <p className="mt-1.5 text-sm text-midnight-600">
            The website shows this word-for-word, exactly as you type it.
          </p>
        </div>
        <div>
          <label htmlFor="dw-title" className={label}>
            Devotional title
          </label>
          <input
            id="dw-title"
            name="title"
            type="text"
            required
            placeholder="Example: Love That Never Fails"
            value={preview.title}
            onChange={update("title")}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="dw-message" className={label}>
            Pastor&apos;s message
          </label>
          <textarea
            id="dw-message"
            name="message"
            rows={7}
            required
            value={preview.message}
            onChange={update("message")}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="dw-prayer" className={label}>
            Closing prayer{" "}
            <span className="font-normal text-midnight-600">(optional)</span>
          </label>
          <textarea
            id="dw-prayer"
            name="prayer"
            rows={3}
            value={preview.prayer}
            onChange={update("prayer")}
            className={field}
          />
        </div>

        <FormMessage state={state} />

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            name="status"
            value="published"
            disabled={pending}
            className="inline-flex min-h-12 items-center rounded-full bg-royal-600 px-7 py-3 font-semibold text-white transition-colors hover:bg-royal-500 disabled:opacity-60"
          >
            {pending ? "Saving…" : "Publish"}
          </button>
          <button
            type="submit"
            name="status"
            value="draft"
            disabled={pending}
            className="inline-flex min-h-12 items-center rounded-full bg-midnight-50 px-7 py-3 font-semibold text-midnight-800 transition-colors hover:bg-midnight-100 disabled:opacity-60"
          >
            Save as Draft
          </button>
        </div>
      </form>

      <aside aria-label="Live preview">
        <p className="mb-3 text-sm font-semibold tracking-wide text-royal-700 uppercase">
          Live preview
        </p>
        <article className="rounded-3xl border border-cream-300 bg-white p-7 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-100">
              <BookOpen className="h-5 w-5 text-gold-700" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-royal-700 uppercase">
                Daily Word
              </p>
              <p className="text-sm text-midnight-700">
                {preview.word_date ? formatDate(preview.word_date) : "Date"}
              </p>
            </div>
          </div>
          <h3 className="mt-6 font-serif text-2xl font-semibold text-midnight-900">
            {preview.title || "Your title will appear here"}
          </h3>
          <blockquote className="mt-5 rounded-2xl border-l-4 border-gold-400 bg-cream-100 p-5">
            <p className="font-serif text-lg text-midnight-900">
              &ldquo;{preview.scripture_text || "The scripture text will appear here."}&rdquo;
            </p>
            <cite className="mt-2 block text-sm font-semibold text-royal-700 not-italic">
              {preview.scripture_reference || "Scripture reference"}
            </cite>
          </blockquote>
          <p className="mt-5 whitespace-pre-line text-midnight-800">
            {preview.message || "Your message will appear here."}
          </p>
          {preview.prayer && (
            <p className="mt-5 rounded-2xl bg-royal-50 p-5 whitespace-pre-line text-midnight-800 italic">
              {preview.prayer}
            </p>
          )}
        </article>
      </aside>
    </div>
  );
}
