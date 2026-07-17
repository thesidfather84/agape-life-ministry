"use client";

import { useState } from "react";
import { initialFormState, type FormState } from "@/lib/form-state";
import { btn, field, label } from "@/lib/ui";
import FormMessage, { HoneypotField } from "./FormMessage";

export default function ContactForm() {
  const [state, setState] = useState<FormState>(initialFormState);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    );

    setPending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = (await response.json().catch(() => null)) as {
        ok?: boolean;
        message?: string;
      } | null;

      if (response.ok && result?.ok) {
        setState({
          status: "success",
          message:
            result.message ??
            "Thank you for reaching out. We will get back to you soon.",
        });
      } else {
        setState({
          status: "error",
          message:
            result?.message ??
            "We couldn't send your message just now. Please try again in a moment.",
        });
      }
    } catch {
      setState({
        status: "error",
        message:
          "We couldn't send your message. Please check your connection and try again.",
      });
    } finally {
      setPending(false);
    }
  }

  if (state.status === "success") {
    return <FormMessage state={state} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
