"use client";

import { useActionState } from "react";
import { submitSmsOptin } from "@/app/actions/public";
import { initialFormState } from "@/lib/form-state";
import { field, label } from "@/lib/ui";
import FormMessage, { HoneypotField } from "./FormMessage";

export default function SmsSignupForm() {
  const [state, formAction, pending] = useActionState(
    submitSmsOptin,
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
          <label htmlFor="sms-first-name" className={label}>
            First name
          </label>
          <input
            id="sms-first-name"
            name="first_name"
            type="text"
            required
            autoComplete="given-name"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="sms-phone" className={label}>
            Mobile number
          </label>
          <input
            id="sms-phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="(504) 555-0123"
            className={field}
          />
        </div>
      </div>
      <label className="flex items-start gap-3 text-sm text-midnight-800">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 h-5 w-5 shrink-0 rounded border-midnight-200 accent-royal-600"
        />
        <span>
          I agree to receive encouragement and scripture text messages from
          Agape Life Ministry. Message frequency may vary. Standard message
          and data rates may apply. Reply STOP at any time to unsubscribe.
        </span>
      </label>

      <FormMessage state={state} />

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-gold-400 px-7 py-3 font-semibold text-midnight-950 transition-colors hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing Up…" : "Sign Me Up"}
      </button>
      <p className="text-sm text-midnight-600">
        Text messages have not started yet — you are joining the list for when
        they begin.
      </p>
    </form>
  );
}
