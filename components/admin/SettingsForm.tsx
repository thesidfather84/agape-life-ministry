"use client";

import { useActionState } from "react";
import { saveSettings } from "@/app/actions/admin";
import { initialFormState } from "@/lib/form-state";
import { field, label } from "@/lib/ui";
import type { ChurchSettings } from "@/lib/types";
import FormMessage from "@/components/forms/FormMessage";

export default function SettingsForm({
  settings,
}: {
  settings: ChurchSettings;
}) {
  const [state, formAction, pending] = useActionState(
    saveSettings,
    initialFormState
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="st-name" className={label}>
            Church name
          </label>
          <input
            id="st-name"
            name="church_name"
            type="text"
            required
            defaultValue={settings.church_name}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="st-pastor" className={label}>
            Pastor name
          </label>
          <input
            id="st-pastor"
            name="pastor_name"
            type="text"
            required
            defaultValue={settings.pastor_name}
            className={field}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="st-phone" className={label}>
            Church phone number
          </label>
          <input
            id="st-phone"
            name="phone"
            type="tel"
            defaultValue={settings.phone ?? ""}
            placeholder="Not set yet — add it when ready"
            className={field}
          />
          {!settings.phone && (
            <p className="mt-1.5 text-sm font-medium text-gold-700">
              Placeholder — the website says &ldquo;coming soon&rdquo; until
              you add a number.
            </p>
          )}
        </div>
        <div>
          <label htmlFor="st-email" className={label}>
            Church email
          </label>
          <input
            id="st-email"
            name="email"
            type="email"
            defaultValue={settings.email ?? ""}
            placeholder="Not set yet — add it when ready"
            className={field}
          />
          {!settings.email && (
            <p className="mt-1.5 text-sm font-medium text-gold-700">
              Placeholder — the website says &ldquo;coming soon&rdquo; until
              you add an email.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="st-addr1" className={label}>
            Street address
          </label>
          <input
            id="st-addr1"
            name="address_line1"
            type="text"
            required
            defaultValue={settings.address_line1}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="st-addr2" className={label}>
            Suite / unit{" "}
            <span className="font-normal text-midnight-600">(optional)</span>
          </label>
          <input
            id="st-addr2"
            name="address_line2"
            type="text"
            defaultValue={settings.address_line2 ?? ""}
            className={field}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="st-city" className={label}>
            City
          </label>
          <input
            id="st-city"
            name="city"
            type="text"
            required
            defaultValue={settings.city}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="st-state" className={label}>
            State
          </label>
          <input
            id="st-state"
            name="state"
            type="text"
            required
            defaultValue={settings.state}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="st-zip" className={label}>
            ZIP code
          </label>
          <input
            id="st-zip"
            name="zip"
            type="text"
            required
            defaultValue={settings.zip}
            className={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor="st-service" className={label}>
          Service time (shown on the website)
        </label>
        <input
          id="st-service"
          name="service_time_text"
          type="text"
          required
          defaultValue={settings.service_time_text}
          className={field}
        />
      </div>

      <FormMessage state={state} />

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center rounded-full bg-royal-600 px-7 py-3 font-semibold text-white transition-colors hover:bg-royal-500 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Church Information"}
      </button>
    </form>
  );
}
