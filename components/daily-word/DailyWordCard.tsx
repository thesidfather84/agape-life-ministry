import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { DailyWord } from "@/lib/types";
import { formatDate } from "@/lib/format";
import ShareButton from "./ShareButton";

export default function DailyWordCard({
  word,
  featured = false,
}: {
  word: DailyWord;
  featured?: boolean;
}) {
  return (
    <article
      className={`rounded-3xl border border-cream-300 bg-white p-7 shadow-sm sm:p-9 ${
        featured ? "mx-auto max-w-3xl" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-100">
          <BookOpen className="h-5 w-5 text-gold-700" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-royal-700 uppercase">
            Daily Word
          </p>
          <time dateTime={word.word_date} className="text-sm text-midnight-700">
            {formatDate(word.word_date)}
          </time>
        </div>
      </div>

      <h3 className="mt-6 font-serif text-2xl font-semibold text-midnight-900">
        {word.title}
      </h3>

      <blockquote className="mt-5 rounded-2xl border-l-4 border-gold-400 bg-cream-100 p-5">
        <p className="font-serif text-lg text-midnight-900">
          &ldquo;{word.scripture_text}&rdquo;
        </p>
        <cite className="mt-2 block text-sm font-semibold text-royal-700 not-italic">
          {word.scripture_reference}
        </cite>
      </blockquote>

      <p className="mt-5 whitespace-pre-line text-midnight-800">
        {featured && word.message.length > 320
          ? `${word.message.slice(0, 320).trimEnd()}…`
          : word.message}
      </p>

      {!featured && word.prayer && (
        <p className="mt-5 rounded-2xl bg-royal-50 p-5 whitespace-pre-line text-midnight-800 italic">
          {word.prayer}
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <ShareButton
          title={`Daily Word — ${word.title}`}
          text={`"${word.scripture_text}" — ${word.scripture_reference}`}
          path={`/daily-word/${word.id}`}
        />
        {featured && (
          <Link
            href={`/daily-word/${word.id}`}
            className="inline-flex min-h-11 items-center rounded-full bg-royal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-royal-500"
          >
            Read More
          </Link>
        )}
      </div>
    </article>
  );
}
