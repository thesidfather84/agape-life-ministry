import { BookOpen, ExternalLink, UserRound } from "lucide-react";
import type { Sermon } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { isSafeEmbedUrl } from "@/lib/facebook";
import SermonEmbed from "./SermonEmbed";
import ShareButton from "@/components/daily-word/ShareButton";

export default function SermonCard({
  sermon,
  featured = false,
}: {
  sermon: Sermon;
  featured?: boolean;
}) {
  const canEmbed = Boolean(sermon.embed_url && isSafeEmbedUrl(sermon.embed_url));

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-3xl border border-cream-300 bg-white shadow-sm ${
        featured ? "mx-auto max-w-2xl" : ""
      }`}
    >
      <div className="p-5 pb-0 sm:p-7 sm:pb-0">
        {sermon.video_url ? (
          /* Uploaded video — plays right on the page, never autoplays. */
          <video
            controls
            preload="metadata"
            playsInline
            poster={sermon.thumbnail_url ?? undefined}
            className="aspect-video w-full rounded-2xl bg-midnight-950 object-contain"
          >
            <source src={sermon.video_url} />
            Your browser can&apos;t play this video.
          </video>
        ) : canEmbed ? (
          <SermonEmbed embedUrl={sermon.embed_url!} title={sermon.title} />
        ) : sermon.facebook_url ? (
          <a
            href={sermon.facebook_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-light group flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-2xl text-cream-50"
          >
            <ExternalLink className="h-9 w-9 text-gold-400" aria-hidden />
            <span className="px-6 text-center text-sm font-semibold">
              Watch this sermon on Facebook
            </span>
          </a>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-7">
        <time
          dateTime={sermon.sermon_date}
          className="text-sm font-semibold tracking-wide text-royal-700 uppercase"
        >
          {formatDate(sermon.sermon_date)}
        </time>
        <h3 className="mt-2 font-serif text-xl font-semibold text-midnight-900 sm:text-2xl">
          {sermon.title}
        </h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-midnight-700">
          <UserRound className="h-4 w-4 shrink-0 text-gold-600" aria-hidden />
          {sermon.speaker_name}
        </p>
        {sermon.scripture_reference && (
          <p className="mt-1.5 flex items-center gap-2 text-sm text-midnight-700">
            <BookOpen className="h-4 w-4 shrink-0 text-gold-600" aria-hidden />
            {sermon.scripture_reference}
          </p>
        )}
        {sermon.description && (
          <p className="mt-3 flex-1 text-midnight-800">{sermon.description}</p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {sermon.facebook_url && (
            <a
              href={sermon.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-royal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-royal-500"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              Watch on Facebook
            </a>
          )}
          <ShareButton
            title={`Sermon — ${sermon.title}`}
            text={`${sermon.title} — ${sermon.speaker_name}, Agape Life Ministry`}
            path="/sermons"
          />
        </div>
      </div>
    </article>
  );
}
