"use client";

import { useActionState } from "react";
import { submitWelcomeCard } from "@/app/actions/public";
import { initialFormState } from "@/lib/form-state";
import { btn, field, label } from "@/lib/ui";
import FormMessage, { HoneypotField } from "./FormMessage";

export default function ImNewForm() {
  const [state, formAction, pending] = useActionState(
    submitWelcomeCard,
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
          <label htmlFor="new-first-name" className={label}>
            First name
          </label>
          <input
            id="new-first-name"
            name="first_name"
            type="text"
            required
            autoComplete="given-name"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="new-contact" className={label}>
            Phone or email{" "}
            <span className="font-normal text-midnight-600">(optional)</span>
          </label>
          <input
            id="new-contact"
            name="contact"
            type="text"
            autoComplete="email"
            className={field}
          />
        </div>
      </div>
      <div>
        <label htmlFor="new-questions" className={label}>
          Questions for us{" "}
          <span className="font-normal text-midnight-600">(optional)</span>
        </label>
        <textarea
          id="new-questions"
          name="questions"
          rows={3}
          maxLength={2000}
          className={field}
          placeholder="Anything you'd like to know before you visit?"
        />
      </div>
      <label className="flex items-start gap-3 text-sm text-midnight-800">
        <input
          type="checkbox"
          name="wants_contact"
          className="mt-1 h-5 w-5 rounded border-midnight-200 accent-royal-600"
        />
        I would like someone from the church to contact me
      </label>

      <FormMessage state={state} />

      <button type="submit" disabled={pending} className={btn.gold}>
        {pending ? "Sending…" : "Say Hello"}
      </button>
    </form>
  );
}
