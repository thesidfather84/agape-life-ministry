"use client";

import { useActionState } from "react";
import { saveAnnouncement } from "@/app/actions/admin";
import { initialFormState } from "@/lib/form-state";
import { field, label } from "@/lib/ui";
import type { Announcement } from "@/lib/types";
import FormMessage from "@/components/forms/FormMessage";

export default function AnnouncementForm({
  announcement,
}: {
  announcement?: Announcement | null;
}) {
  const [state, formAction, pending] = useActionState(
    saveAnnouncement,
    initialFormState
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-5" noValidate>
      {announcement && (
        <input type="hidden" name="id" value={announcement.id} />
      )}

      <div>
        <label htmlFor="an-message" className={label}>
          Announcement text
        </label>
        <textarea
          id="an-message"
          name="message"
          rows={3}
          maxLength={280}
          defaultValue={announcement?.message ?? ""}
          placeholder="Example: Service this Sunday will begin at 10:00 AM due to weather."
          className={field}
        />
        <p className="mt-1.5 text-sm text-midnight-600">
          Keep it short — it appears as a banner at the top of every page.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="an-link" className={label}>
            Link{" "}
            <span className="font-normal text-midnight-600">(optional)</span>
          </label>
          <input
            id="an-link"
            name="link_url"
            type="url"
            defaultValue={announcement?.link_url ?? ""}
            placeholder="https://…"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="an-link-label" className={label}>
            Link text{" "}
            <span className="font-normal text-midnight-600">(optional)</span>
          </label>
          <input
            id="an-link-label"
            name="link_label"
            type="text"
            defaultValue={announcement?.link_label ?? ""}
            placeholder="Learn more"
            className={field}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="an-start" className={label}>
            Start showing on{" "}
            <span className="font-normal text-midnight-600">(optional)</span>
          </label>
          <input
            id="an-start"
            name="starts_on"
            type="date"
            defaultValue={announcement?.starts_on ?? ""}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="an-end" className={label}>
            Stop showing after{" "}
            <span className="font-normal text-midnight-600">(optional)</span>
          </label>
          <input
            id="an-end"
            name="ends_on"
            type="date"
            defaultValue={announcement?.ends_on ?? ""}
            className={field}
          />
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-cream-300 bg-cream-100 p-4 font-semibold text-midnight-900">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={announcement?.is_active ?? false}
          className="h-6 w-6 rounded border-midnight-200 accent-royal-600"
        />
        Show this announcement on the website
      </label>

      <FormMessage state={state} />

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center rounded-full bg-royal-600 px-7 py-3 font-semibold text-white transition-colors hover:bg-royal-500 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Announcement"}
      </button>
    </form>
  );
}
