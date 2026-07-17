import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPastorNotification, submittedAt } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * Contact form endpoint. A plain API route (instead of a Server
 * Action) so cached pages can never reference a stale action ID after
 * a redeploy — the URL /api/contact is stable across builds.
 *
 * Uses NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY. The
 * service role key stays server-side only; it is never sent to the
 * browser and never included in any response.
 *
 * Inserts into public.contact_messages, whose columns are:
 *   name, contact (email or phone), subject (nullable), message
 * (id, is_read, created_at are set by the database.)
 */

const GENERIC_ERROR =
  "We couldn't send your message just now. Please try again in a moment.";

interface ContactBody {
  name?: unknown;
  contact?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown; // honeypot
}

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function json(status: number, body: { ok: boolean; message: string }) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  let raw: ContactBody;
  try {
    raw = (await request.json()) as ContactBody;
  } catch {
    return json(400, { ok: false, message: "Please fill out the form and try again." });
  }

  // Honeypot: bots fill the hidden field. Pretend success, store nothing.
  if (asTrimmedString(raw.website) !== "") {
    return json(200, { ok: true, message: "Thank you." });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (!checkRateLimit(`contact:${ip}`, 5, 10 * 60_000)) {
    return json(429, {
      ok: false,
      message:
        "You've sent several messages in a short time. Please wait a few minutes and try again.",
    });
  }

  const name = asTrimmedString(raw.name);
  const contact = asTrimmedString(raw.contact);
  const subject = asTrimmedString(raw.subject);
  const message = asTrimmedString(raw.message);

  if (!name || name.length > 200) {
    return json(400, { ok: false, message: "Please tell us your name." });
  }
  if (!contact || contact.length > 200) {
    return json(400, {
      ok: false,
      message: "Please include an email or phone number so we can reply.",
    });
  }
  if (message.length < 3) {
    return json(400, { ok: false, message: "Please write a short message." });
  }
  if (message.length > 5000 || subject.length > 200) {
    return json(400, {
      ok: false,
      message:
        "Your message is a little long — please shorten it and try again.",
    });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error(
      "[contact] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
    );
    return json(500, { ok: false, message: GENERIC_ERROR });
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("contact_messages").insert({
    name,
    contact,
    subject: subject || null,
    message,
  });

  if (error) {
    // Full details server-side only; the visitor sees a generic message.
    console.error(
      `[contact] Supabase insert failed: code=${error.code} message=${error.message}`
    );
    return json(500, { ok: false, message: GENERIC_ERROR });
  }

  // Notify the pastor. Never blocks the response — the message is saved.
  const isEmail = looksLikeEmail(contact);
  await sendPastorNotification({
    subject: "New Website Contact Message — Agape Life Ministry",
    heading: "New Contact Message",
    fields: [
      { label: "Name", value: name },
      { label: isEmail ? "Email" : "Phone / contact", value: contact },
      { label: "Subject", value: subject || "Not given" },
      { label: "Message", value: message },
      { label: "Submitted", value: submittedAt() },
    ],
    buttonLabel: "Open Message Inbox",
    buttonPath: "/admin/messages",
    ...(isEmail ? { replyTo: contact } : {}),
  });

  return json(200, {
    ok: true,
    message: "Thank you for reaching out. We will get back to you soon.",
  });
}
