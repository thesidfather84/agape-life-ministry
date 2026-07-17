"use client";

import { useActionState } from "react";
import { submitContactMessage } from "@/app/actions/public";
import { initialFormState } from "@/lib/form-state";
import { btn, field, label } from "@/lib/ui";
import FormMessage, { HoneypotField } from "./FormMessage";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactMessage,
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
          <label htmlFor="ct-name" className={label}>
            Your name
          </label>
          <input
            id="ct-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="ct-contact" className={label}>
            Email or phone
          </label>
          <input
            id="ct-contact"
            name="contact"
            type="text"
            required
            autoComplete="email"
            className={field}
          />
        </div>
      </div>
      <div>
        <label htmlFor="ct-subject" className={label}>
          Subject{" "}
          <span className="font-normal text-midnight-600">(optional)</span>
        </label>
        <input
          id="ct-subject"
          name="subject"
          type="text"
          maxLength={200}
          className={field}
          placeholder="What is this about?"
        />
      </div>
      <div>
        <label htmlFor="ct-message" className={label}>
          Your message
        </label>
        <textarea
          id="ct-message"
          name="message"
          rows={5}
          required
          maxLength={5000}
          className={field}
          placeholder="How can we help you?"
        />
      </div>

      <FormMessage state={state} />

      <button type="submit" disabled={pending} className={btn.royal}>
        {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
