import { Star } from "lucide-react";
import { setSermonFeatured, setSermonPublished } from "@/app/actions/admin";
import { formatDateShort } from "@/lib/format";
import type { Sermon } from "@/lib/types";

/**
 * The pastor's sermon list: one big ON/OFF visibility toggle per
 * sermon (no confirmation — nothing is deleted) plus a Featured
 * toggle. Only one sermon can be featured at a time; the server
 * action enforces that.
 */
export default function PastorSermonList({ sermons }: { sermons: Sermon[] }) {
  if (sermons.length === 0) {
    return (
      <p className="rounded-3xl border border-cream-300 bg-white p-8 text-center text-lg text-midnight-700">
        Your published sermons will appear here.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {sermons.map((sermon) => (
        <li
          key={sermon.id}
          className="rounded-3xl border border-cream-300 bg-white p-5 sm:p-6"
        >
          <p className="text-lg font-semibold text-midnight-900">
            {sermon.title}
          </p>
          <p className="mt-0.5 text-midnight-700">
            {formatDateShort(sermon.sermon_date)}
            {sermon.video_url ? " · Uploaded video" : " · Facebook"}
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <form action={setSermonPublished} className="flex-1">
              <input type="hidden" name="id" value={sermon.id} />
              <input
                type="hidden"
                name="publish"
                value={sermon.published ? "false" : "true"}
              />
              <button
                type="submit"
                aria-pressed={sermon.published}
                className={`flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-lg font-bold transition-colors ${
                  sermon.published
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
              >
                <span aria-hidden>{sermon.published ? "🟢" : "🔴"}</span>
                {sermon.published
                  ? "ON — everyone can see it"
                  : "OFF — hidden from the public"}
              </button>
            </form>

            <form action={setSermonFeatured} className="flex-1">
              <input type="hidden" name="id" value={sermon.id} />
              <input
                type="hidden"
                name="feature"
                value={sermon.is_featured ? "false" : "true"}
              />
              <button
                type="submit"
                aria-pressed={sermon.is_featured}
                className={`flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-lg font-bold transition-colors ${
                  sermon.is_featured
                    ? "bg-gold-200 text-gold-700 hover:bg-gold-300"
                    : "bg-midnight-50 text-midnight-700 hover:bg-midnight-100"
                }`}
              >
                <Star
                  className={`h-5 w-5 ${sermon.is_featured ? "fill-current" : ""}`}
                  aria-hidden
                />
                {sermon.is_featured ? "Featured on homepage" : "Make featured"}
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
