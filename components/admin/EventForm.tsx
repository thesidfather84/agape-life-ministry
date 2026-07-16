"use client";

import { useActionState } from "react";
import { saveEvent } from "@/app/actions/admin";
import { initialFormState } from "@/lib/form-state";
import { field, label } from "@/lib/ui";
import { FULL_ADDRESS } from "@/lib/site";
import type { ChurchEvent } from "@/lib/types";
import FormMessage from "@/components/forms/FormMessage";

export default function EventForm({ event }: { event?: ChurchEvent }) {
  const [state, formAction, pending] = useActionState(
    saveEvent,
    initialFormState
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-5" noValidate>
      {event && <input type="hidden" name="id" value={event.id} />}

      <div>
        <label htmlFor="ev-title" className={label}>
          Event name
        </label>
        <input
          id="ev-title"
          name="title"
          type="text"
          required
          defaultValue={event?.title}
          placeholder="Example: Community Prayer Night"
          className={field}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="ev-date" className={label}>
            Date
          </label>
          <input
            id="ev-date"
            name="event_date"
            type="date"
            required
            defaultValue={event?.event_date}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="ev-start" className={label}>
            Start time
          </label>
          <input
            id="ev-start"
            name="start_time"
            type="time"
            required
            defaultValue={event?.start_time?.slice(0, 5) ?? "09:00"}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="ev-end" className={label}>
            End time{" "}
            <span className="font-normal text-midnight-600">(optional)</span>
          </label>
          <input
            id="ev-end"
            name="end_time"
            type="time"
            defaultValue={event?.end_time?.slice(0, 5) ?? ""}
            className={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor="ev-location" className={label}>
          Address
        </label>
        <input
          id="ev-location"
          name="location"
          type="text"
          required
          defaultValue={event?.location ?? FULL_ADDRESS}
          className={field}
        />
      </div>

      <div>
        <label htmlFor="ev-description" className={label}>
          Description
        </label>
        <textarea
          id="ev-description"
          name="description"
          rows={4}
          required
          defaultValue={event?.description}
          placeholder="A short, friendly description of the event."
          className={field}
        />
      </div>

      <div>
        <label htmlFor="ev-image" className={label}>
          Picture link{" "}
          <span className="font-normal text-midnight-600">(optional)</span>
        </label>
        <input
          id="ev-image"
          name="image_url"
          type="url"
          defaultValue={event?.image_url ?? ""}
          placeholder="Paste a link to a photo, or leave this empty."
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
          {pending ? "Saving…" : "Publish Event"}
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
  );
}
