"use client";

import { useActionState } from "react";
import { submitPrayerRequest } from "@/app/actions/public";
import { initialFormState } from "@/lib/form-state";
import { btn, field, label } from "@/lib/ui";
import FormMessage, { HoneypotField } from "./FormMessage";

export default function PrayerRequestForm() {
  const [state, formAction, pending] = useActionState(
    submitPrayerRequest,
    initialFormState
  );

  if (state.status === "success") {
    return <FormMessage state={state} />;
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <HoneypotField />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="pr-name" className={label}>
            Your name <span className="font-normal text-midnight-600">(optional)</span>
          </label>
          <input
            id="pr-name"
            name="name"
            type="text"
            autoComplete="name"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="pr-contact" className={label}>
            Email or phone <span className="font-normal text-midnight-600">(optional)</span>
          </label>
          <input
            id="pr-contact"
            name="contact"
            type="text"
            autoComplete="email"
            className={field}
          />
        </div>
      </div>
      <div>
        <label htmlFor="pr-request" className={label}>
          Your prayer request
        </label>
        <textarea
          id="pr-request"
          name="request"
          rows={5}
          required
          maxLength={5000}
          className={field}
          placeholder="Share what is on your heart…"
        />
      </div>
      <label className="flex items-start gap-3 text-sm text-midnight-800">
        <input
          type="checkbox"
          name="confidential"
          className="mt-1 h-5 w-5 rounded border-midnight-200 accent-royal-600"
        />
        Keep this confidential (only the pastor will see it)
      </label>

      <FormMessage state={state} />

      <button type="submit" disabled={pending} className={btn.royal}>
        {pending ? "Sending…" : "Send Prayer Request"}
      </button>
      <p className="text-sm text-midnight-600">
        Prayer requests are never shared publicly.
      </p>
    </form>
  );
}
