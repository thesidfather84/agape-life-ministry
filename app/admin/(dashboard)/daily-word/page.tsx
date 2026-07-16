import Link from "next/link";
import { Plus } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { deleteDailyWord } from "@/app/actions/admin";
import DeleteButton from "@/components/admin/DeleteButton";
import SavedBanner from "@/components/admin/SavedBanner";
import type { DailyWord } from "@/lib/types";

export default async function AdminDailyWordList({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("daily_words")
    .select("*")
    .order("word_date", { ascending: false })
    .limit(200);
  const words = (data ?? []) as DailyWord[];

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-midnight-900">
            Daily Word Posts
          </h1>
          <p className="mt-1 text-midnight-700">
            Today&apos;s scripture and past posts.
          </p>
        </div>
        <Link
          href="/admin/daily-word/new"
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-royal-600 px-6 py-3 font-semibold text-white hover:bg-royal-500"
        >
          <Plus className="h-5 w-5" aria-hidden />
          Post Today&apos;s Scripture
        </Link>
      </div>

      {saved === "published" && (
        <SavedBanner text="Your Daily Word has been published. It is now on the website." />
      )}
      {saved === "draft" && (
        <SavedBanner text="Saved as a draft. It is not on the website yet — publish it when you're ready." />
      )}
      {deleted && <SavedBanner text="The post has been deleted." />}

      {words.length === 0 ? (
        <p className="rounded-3xl border border-cream-300 bg-white p-8 text-center text-midnight-700">
          No posts yet. Tap &ldquo;Post Today&apos;s Scripture&rdquo; to share
          your first Daily Word.
        </p>
      ) : (
        <ul className="space-y-4">
          {words.map((word) => (
            <li
              key={word.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-cream-300 bg-white p-5"
            >
              <div>
                <p className="font-semibold text-midnight-900">{word.title}</p>
                <p className="text-sm text-midnight-700">
                  {formatDate(word.word_date)} · {word.scripture_reference} ·{" "}
                  {word.status === "published" ? (
                    <span className="font-semibold text-royal-700">
                      Published
                    </span>
                  ) : (
                    <span className="font-semibold text-gold-700">Draft</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/daily-word/${word.id}`}
                  className="inline-flex min-h-10 items-center rounded-full bg-midnight-50 px-5 py-2 text-sm font-semibold text-midnight-800 hover:bg-midnight-100"
                >
                  Edit
                </Link>
                <DeleteButton action={deleteDailyWord} id={word.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
