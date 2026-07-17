"use client";

import { useActionState, useState } from "react";
import { CircleHelp, ExternalLink } from "lucide-react";
import { saveSermon } from "@/app/actions/admin";
import { initialFormState } from "@/lib/form-state";
import { field, label } from "@/lib/ui";
import { parseFacebookUrl } from "@/lib/facebook";
import { todayInChicago } from "@/lib/format";
import type { Sermon } from "@/lib/types";
import FormMessage from "@/components/forms/FormMessage";
import SermonEmbed from "@/components/sermons/SermonEmbed";

export default function SermonForm({ sermon }: { sermon?: Sermon }) {
  const [state, formAction, pending] = useActionState(
    saveSermon,
    initialFormState
  );

  const [url, setUrl] = useState(sermon?.facebook_url ?? "");
  const [title, setTitle] = useState(sermon?.title ?? "");
  const [showPreview, setShowPreview] = useState(false);

  const parsed = url.trim() ? parseFacebookUrl(url) : null;

  return (
    <div className="max-w-2xl space-y-8">
      <div className="rounded-3xl border border-gold-200 bg-gold-50 p-6">
        <p className="flex items-start gap-3 font-semibold text-midnight-900">
          <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" aria-hidden />
          How to Copy Your Facebook Reel Link
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-10 text-midnight-800">
          <li>Open the Reel in Facebook.</li>
          <li>Tap Share.</li>
          <li>Tap Copy Link.</li>
          <li>Return here and paste the link.</li>
        </ol>
      </div>

      <form action={formAction} className="space-y-5" noValidate>
        {sermon && <input type="hidden" name="id" value={sermon.id} />}
        {sermon?.video_url && (
          <input type="hidden" name="video_url" value={sermon.video_url} />
        )}

        <div>
          <label htmlFor="sm-url" className={label}>
            Facebook Reel link
            {sermon?.video_url && (
              <span className="font-normal text-midnight-600">
                {" "}
                (optional — this sermon uses an uploaded video)
              </span>
            )}
          </label>
          <input
            id="sm-url"
            name="facebook_url"
            type="url"
            required={!sermon?.video_url}
            inputMode="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setShowPreview(false);
            }}
            placeholder="https://www.facebook.com/reel/…"
            className={field}
          />
          <p className="mt-1.5 text-sm text-midnight-600">
            Post your sermon to Facebook first. Then copy the Reel link,
            paste it here, and press Publish.
          </p>
          {url.trim() !== "" && parsed && !parsed.ok && (
            <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">
              {parsed.error}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="sm-title" className={label}>
            Sermon title
          </label>
          <input
            id="sm-title"
            name="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Example: Love That Never Lets Go"
            className={field}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="sm-speaker" className={label}>
              Speaker
            </label>
            <input
              id="sm-speaker"
              name="speaker_name"
              type="text"
              defaultValue={sermon?.speaker_name ?? "Founder / Pastor Arthur Warning"}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="sm-date" className={label}>
              Sermon date
            </label>
            <input
              id="sm-date"
              name="sermon_date"
              type="date"
              required
              defaultValue={sermon?.sermon_date ?? todayInChicago()}
              className={field}
            />
          </div>
        </div>

        <div>
          <label htmlFor="sm-scripture" className={label}>
            Scripture reference{" "}
            <span className="font-normal text-midnight-600">(optional)</span>
          </label>
          <input
            id="sm-scripture"
            name="scripture_reference"
            type="text"
            defaultValue={sermon?.scripture_reference ?? ""}
            placeholder="Example: John 3:16"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="sm-description" className={label}>
            Short description{" "}
            <span className="font-normal text-midnight-600">(optional)</span>
          </label>
          <textarea
            id="sm-description"
            name="description"
            rows={3}
            maxLength={600}
            defaultValue={sermon?.description ?? ""}
            className={field}
          />
        </div>

        <FormMessage state={state} />

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            disabled={!parsed?.ok}
            className="inline-flex min-h-12 items-center rounded-full border-2 border-midnight-600 px-7 py-3 font-semibold text-midnight-800 transition-colors hover:border-royal-500 hover:text-royal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Preview
          </button>
          <button
            type="submit"
            name="published"
            value="published"
            disabled={pending}
            className="inline-flex min-h-12 items-center rounded-full bg-royal-600 px-7 py-3 font-semibold text-white transition-colors hover:bg-royal-500 disabled:opacity-60"
          >
            {pending ? "Saving…" : "Publish Sermon"}
          </button>
          <button
            type="submit"
            name="published"
            value="draft"
            disabled={pending}
            className="inline-flex min-h-12 items-center rounded-full bg-midnight-50 px-7 py-3 font-semibold text-midnight-800 transition-colors hover:bg-midnight-100 disabled:opacity-60"
          >
            Save Draft
          </button>
        </div>
      </form>

      {showPreview && parsed?.ok && (
        <aside aria-label="Sermon preview" className="space-y-3">
          <p className="text-sm font-semibold tracking-wide text-royal-700 uppercase">
            Preview
          </p>
          {parsed.embedUrl ? (
            <SermonEmbed
              embedUrl={parsed.embedUrl}
              title={title || "Sermon preview"}
            />
          ) : (
            <div className="rounded-2xl border border-cream-300 bg-cream-100 p-6 text-midnight-800">
              <p>
                This link can&apos;t show a video player on the website, so
                visitors will see a clean card with a &ldquo;Watch on
                Facebook&rdquo; button instead — that works fine.
              </p>
              <a
                href={parsed.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-royal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-royal-500"
              >
                <ExternalLink className="h-4 w-4" aria-hidden />
                Test the link on Facebook
              </a>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
