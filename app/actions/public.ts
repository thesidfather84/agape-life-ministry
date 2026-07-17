"use server";

import { headers } from "next/headers";
import { createPublicClient } from "@/lib/supabase/public";
import { sendPastorNotification, submittedAt, type EmailField } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import type { FormState } from "@/lib/form-state";

const NOT_CONFIGURED =
  "The website is not connected to its database yet. Please try again later or contact the church directly.";

const TOO_MANY =
  "You've sent several submissions in a short time. Please wait a few minutes and try again.";

function trimmed(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** Basic honeypot check — bots fill the hidden field, people do not. */
function isBot(formData: FormData): boolean {
  return trimmed(formData, "website") !== "";
}

async function clientKey(form: string): Promise<string> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  return `${form}:${ip}`;
}

export async function submitPrayerRequest(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (isBot(formData)) return { status: "success", message: "Thank you." };
  if (!checkRateLimit(await clientKey("prayer"), 5, 10 * 60_000)) {
    return { status: "error", message: TOO_MANY };
  }

  const request = trimmed(formData, "request");
  if (request.length < 3) {
    return {
      status: "error",
      message: "Please share your prayer request before sending.",
    };
  }
  if (request.length > 5000) {
    return {
      status: "error",
      message: "Your request is a little long — please shorten it and try again.",
    };
  }

  const supabase = createPublicClient();
  if (!supabase) return { status: "error", message: NOT_CONFIGURED };

  const name = trimmed(formData, "name") || null;
  const contact = trimmed(formData, "contact") || null;
  const confidential = formData.get("confidential") === "on";

  const { error } = await supabase.from("prayer_requests").insert({
    name,
    contact,
    request,
    confidential,
  });

  if (error) {
    return {
      status: "error",
      message:
        "We couldn't send your request just now. Please try again in a moment.",
    };
  }

  // Notify the pastor. Confidential requests never place the request
  // text or personal details in the email — only a sign-in prompt.
  if (confidential) {
    await sendPastorNotification({
      subject: "New Confidential Prayer Request — Agape Life Ministry",
      heading: "New Confidential Prayer Request",
      intro:
        "A new confidential prayer request was submitted. Please sign in to the secure pastor dashboard to read it.",
      fields: [{ label: "Submitted", value: submittedAt() }],
      buttonLabel: "Open Prayer Requests",
      buttonPath: "/admin/prayer-requests",
    });
  } else {
    const fields: EmailField[] = [
      { label: "Name", value: name ?? "Not given" },
      { label: "Contact", value: contact ?? "Not given" },
      { label: "Prayer request", value: request },
      { label: "Submitted", value: submittedAt() },
    ];
    await sendPastorNotification({
      subject: "New Prayer Request — Agape Life Ministry",
      heading: "New Prayer Request",
      fields,
      buttonLabel: "Open Prayer Requests",
      buttonPath: "/admin/prayer-requests",
    });
  }

  return {
    status: "success",
    message:
      "Your prayer request has been received. You are not alone — our church family will be praying with you and for you.",
  };
}

// The contact form posts JSON to /api/contact (see
// app/api/contact/route.ts) instead of using a Server Action, so
// cached pages can never reference a stale action ID after a deploy.

export async function submitSmsOptin(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (isBot(formData)) return { status: "success", message: "Thank you." };
  if (!checkRateLimit(await clientKey("sms"), 5, 10 * 60_000)) {
    return { status: "error", message: TOO_MANY };
  }

  const firstName = trimmed(formData, "first_name");
  const phone = trimmed(formData, "phone");
  const consented = formData.get("consent") === "on";

  if (!firstName) {
    return { status: "error", message: "Please tell us your first name." };
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) {
    return {
      status: "error",
      message: "Please enter a valid 10-digit mobile number.",
    };
  }
  if (!consented) {
    return {
      status: "error",
      message: "Please check the consent box to receive text messages.",
    };
  }

  const supabase = createPublicClient();
  if (!supabase) return { status: "error", message: NOT_CONFIGURED };

  const { error } = await supabase.from("sms_optins").insert({
    first_name: firstName,
    phone,
    consented: true,
  });

  if (error) {
    return {
      status: "error",
      message: "We couldn't save your signup just now. Please try again soon.",
    };
  }

  await sendPastorNotification({
    subject: "New Scripture Text Signup — Agape Life Ministry",
    heading: "New Scripture Text Signup",
    fields: [
      { label: "First name", value: firstName },
      { label: "Mobile number", value: phone },
      { label: "Consent", value: "Confirmed — agreed to receive text messages" },
      { label: "Submitted", value: submittedAt() },
    ],
    buttonLabel: "Open Signup List",
    buttonPath: "/admin/messages",
  });

  return {
    status: "success",
    message: `Thank you, ${firstName}! You're on the list. Text messages will begin once our messaging service launches.`,
  };
}

export async function submitWelcomeCard(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (isBot(formData)) return { status: "success", message: "Thank you." };
  if (!checkRateLimit(await clientKey("welcome"), 5, 10 * 60_000)) {
    return { status: "error", message: TOO_MANY };
  }

  const firstName = trimmed(formData, "first_name");
  if (!firstName) {
    return { status: "error", message: "Please tell us your first name." };
  }
  const wantsContact = formData.get("wants_contact") === "on";
  const contact = trimmed(formData, "contact");
  const questions = trimmed(formData, "questions");
  if (wantsContact && !contact) {
    return {
      status: "error",
      message:
        "Please add a phone number or email so someone from the church can reach you.",
    };
  }

  const supabase = createPublicClient();
  if (!supabase) return { status: "error", message: NOT_CONFIGURED };

  const { error } = await supabase.from("welcome_cards").insert({
    first_name: firstName,
    contact: contact || null,
    questions: questions || null,
    wants_contact: wantsContact,
  });

  if (error) {
    return {
      status: "error",
      message: "We couldn't save your card just now. Please try again soon.",
    };
  }

  await sendPastorNotification({
    subject: "New Visitor Connection — Agape Life Ministry",
    heading: "New Visitor Connection",
    fields: [
      { label: "First name", value: firstName },
      { label: "Email or phone", value: contact || "Not given" },
      { label: "Questions", value: questions || "None" },
      {
        label: "Wants contact",
        value: wantsContact
          ? "Yes — they asked someone from the church to reach out"
          : "No",
      },
      { label: "Submitted", value: submittedAt() },
    ],
    buttonLabel: "Open Visitor Inbox",
    buttonPath: "/admin/messages",
  });

  return {
    status: "success",
    message: `Welcome, ${firstName}! We're so glad you stopped by. We look forward to meeting you in person.`,
  };
}
