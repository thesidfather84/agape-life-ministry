import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPastorNotification, submittedAt } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * Contact form endpoint. A plain API route (instead of a Server
 * Action) so cached pages can never reference a stale action ID after
 * a redeploy — the URL /api/contact is stable across builds.
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
  // The service role key stays server-side only; it is never sent to
  // the browser and never included in any response. If it is missing
  // or rejected, the anon key still works: RLS explicitly allows
  // anonymous inserts into contact_messages.
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || (!serviceKey && !anonKey)) {
    console.error("[contact] Supabase environment variables are missing.");
    return json(500, { ok: false, message: GENERIC_ERROR });
  }

  const keys = [
    ...(serviceKey ? [{ key: serviceKey, kind: "service" }] : []),
    ...(anonKey ? [{ key: anonKey, kind: "anon" }] : []),
  ];

  let inserted = false;
  for (const { key, kind } of keys) {
    const supabase = createClient(supabaseUrl, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase.from("contact_messages").insert({
      name,
      contact,
      subject: subject || null,
      message,
    });

    if (!error) {
      inserted = true;
      break;
    }

    // Full details server-side only; the visitor sees a generic message.
    console.error(
      `[contact] Supabase insert failed (${kind} key): code=${error.code} message=${error.message}`
    );

    // If the database predates migration 0002 the subject column
    // doesn't exist yet — retry without it, folding the subject into
    // the message so nothing the visitor wrote is lost.
    if (/subject/i.test(error.message)) {
      const { error: retryError } = await supabase
        .from("contact_messages")
        .insert({
          name,
          contact,
          message: subject ? `[Subject: ${subject}]\n\n${message}` : message,
        });
      if (!retryError) {
        console.warn(
          "[contact] Saved without subject column — run supabase/migrations/0002_sermons_and_email.sql to add it."
        );
        inserted = true;
        break;
      }
      console.error(
        `[contact] Retry without subject failed (${kind} key): code=${retryError.code} message=${retryError.message}`
      );
    }
    // Otherwise fall through and try the next key (e.g. a rejected
    // service key falling back to the anon key).
  }

  if (!inserted) {
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
