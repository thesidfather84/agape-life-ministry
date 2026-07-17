import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { deleteSermon, featureSermon } from "@/app/actions/admin";
import DeleteButton from "@/components/admin/DeleteButton";
import SavedBanner from "@/components/admin/SavedBanner";
import type { Sermon } from "@/lib/types";

export default async function AdminSermonsList({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; featured?: string }>;
}) {
  const { saved, deleted, featured } = await searchParams;
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("sermons")
    .select("*")
    .order("sermon_date", { ascending: false })
    .limit(300);
  const sermons = (data ?? []) as Sermon[];

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-midnight-900">
            Sermons
          </h1>
          <p className="mt-1 text-midnight-700">
            Every sermon you&apos;ve added — newest first.
          </p>
        </div>
        <Link
          href="/admin/sermons/new"
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-royal-600 px-6 py-3 font-semibold text-white hover:bg-royal-500"
        >
          <Plus className="h-5 w-5" aria-hidden />
          Add New Sermon
        </Link>
      </div>

      {saved === "published" && (
        <SavedBanner text="Your sermon has been published. It is now on the website." />
      )}
      {saved === "draft" && (
        <SavedBanner text="Saved as a draft. It is not on the website yet — publish it when you're ready." />
      )}
      {deleted && <SavedBanner text="The sermon has been deleted." />}
      {featured && (
        <SavedBanner text="That sermon is now featured at the top of the Sermons page and on the homepage." />
      )}

      {sermons.length === 0 ? (
        <p className="rounded-3xl border border-cream-300 bg-white p-8 text-center text-midnight-700">
          No sermons yet. Post your sermon to Facebook first, then tap
          &ldquo;Add New Sermon&rdquo; and paste the Reel link.
        </p>
      ) : (
        <ul className="space-y-4">
          {sermons.map((sermon) => (
            <li
              key={sermon.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-cream-300 bg-white p-5"
            >
              <div>
                <p className="font-semibold text-midnight-900">
                  {sermon.title}
                  {sermon.is_featured && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-semibold text-gold-700">
                      <Star className="h-3 w-3" aria-hidden />
                      Featured
                    </span>
                  )}
                </p>
                <p className="text-sm text-midnight-700">
                  {formatDate(sermon.sermon_date)} ·{" "}
                  {sermon.published ? (
                    <span className="font-semibold text-royal-700">
                      Published
                    </span>
                  ) : (
                    <span className="font-semibold text-gold-700">Draft</span>
                  )}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {sermon.published && !sermon.is_featured && (
                  <form action={featureSermon}>
                    <input type="hidden" name="id" value={sermon.id} />
                    <button
                      type="submit"
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-gold-100 px-4 py-2 text-sm font-semibold text-gold-700 hover:bg-gold-200"
                    >
                      <Star className="h-4 w-4" aria-hidden />
                      Feature
                    </button>
                  </form>
                )}
                <Link
                  href="/sermons"
                  className="inline-flex min-h-10 items-center rounded-full bg-midnight-50 px-4 py-2 text-sm font-semibold text-midnight-800 hover:bg-midnight-100"
                >
                  View Public Page
                </Link>
                <Link
                  href={`/admin/sermons/${sermon.id}`}
                  className="inline-flex min-h-10 items-center rounded-full bg-midnight-50 px-5 py-2 text-sm font-semibold text-midnight-800 hover:bg-midnight-100"
                >
                  Edit
                </Link>
                <DeleteButton action={deleteSermon} id={sermon.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
