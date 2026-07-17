"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { parseFacebookUrl } from "@/lib/facebook";
import type { FormState } from "@/lib/form-state";

async function requireAdmin() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function trimmed(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** Refresh every public page after a content change. */
function refreshPublicPages() {
  revalidatePath("/", "layout");
}

const SAVE_ERROR =
  "Something went wrong while saving. Please try again in a moment.";

// ---------------------------------------------------------------- Daily Word

export async function saveDailyWord(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await requireAdmin();

  const id = trimmed(formData, "id");
  const status = formData.get("status") === "published" ? "published" : "draft";
  const record = {
    word_date: trimmed(formData, "word_date"),
    scripture_reference: trimmed(formData, "scripture_reference"),
    scripture_text: trimmed(formData, "scripture_text"),
    title: trimmed(formData, "title"),
    message: trimmed(formData, "message"),
    prayer: trimmed(formData, "prayer") || null,
    status,
  };

  if (!record.word_date) {
    return { status: "error", message: "Please choose a date for this post." };
  }
  if (!record.scripture_reference || !record.scripture_text) {
    return {
      status: "error",
      message:
        "Please fill in both the scripture reference and the scripture text.",
    };
  }
  if (!record.title || !record.message) {
    return {
      status: "error",
      message: "Please add a title and your message before saving.",
    };
  }

  const { error } = id
    ? await supabase.from("daily_words").update(record).eq("id", id)
    : await supabase.from("daily_words").insert(record);

  if (error) return { status: "error", message: SAVE_ERROR };

  refreshPublicPages();
  redirect(
    `/admin/daily-word?saved=${status === "published" ? "published" : "draft"}`
  );
}

export async function deleteDailyWord(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = trimmed(formData, "id");
  if (id) {
    await supabase.from("daily_words").delete().eq("id", id);
    refreshPublicPages();
  }
  redirect("/admin/daily-word?deleted=1");
}

// -------------------------------------------------------------------- Events

export async function saveEvent(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await requireAdmin();

  const id = trimmed(formData, "id");
  const status = formData.get("status") === "published" ? "published" : "draft";
  const record = {
    title: trimmed(formData, "title"),
    event_date: trimmed(formData, "event_date"),
    start_time: trimmed(formData, "start_time"),
    end_time: trimmed(formData, "end_time") || null,
    location: trimmed(formData, "location"),
    description: trimmed(formData, "description"),
    image_url: trimmed(formData, "image_url") || null,
    status,
  };

  if (!record.title) {
    return { status: "error", message: "Please give the event a name." };
  }
  if (!record.event_date || !record.start_time) {
    return {
      status: "error",
      message: "Please choose the event's date and start time.",
    };
  }
  if (!record.location) {
    return { status: "error", message: "Please add the event's address." };
  }
  if (!record.description) {
    return { status: "error", message: "Please add a short description." };
  }

  const { error } = id
    ? await supabase.from("events").update(record).eq("id", id)
    : await supabase.from("events").insert(record);

  if (error) return { status: "error", message: SAVE_ERROR };

  refreshPublicPages();
  redirect(`/admin/events?saved=1`);
}

export async function deleteEvent(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = trimmed(formData, "id");
  if (id) {
    await supabase.from("events").delete().eq("id", id);
    refreshPublicPages();
  }
  redirect("/admin/events?deleted=1");
}

// ------------------------------------------------------------------- Sermons

export async function saveSermon(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await requireAdmin();

  const id = trimmed(formData, "id");
  const published = formData.get("published") === "published";
  const title = trimmed(formData, "title");
  const speakerName =
    trimmed(formData, "speaker_name") || "Founder / Pastor Arthur Warning";
  const sermonDate = trimmed(formData, "sermon_date");
  const rawUrl = trimmed(formData, "facebook_url");

  if (!title) {
    return { status: "error", message: "Please give the sermon a title." };
  }
  if (!sermonDate) {
    return { status: "error", message: "Please choose the sermon date." };
  }

  const parsed = parseFacebookUrl(rawUrl);
  if (!parsed.ok || !parsed.url) {
    return {
      status: "error",
      message:
        parsed.error ??
        "Please paste the sermon's Facebook link before saving.",
    };
  }

  const record = {
    title,
    speaker_name: speakerName,
    sermon_date: sermonDate,
    scripture_reference: trimmed(formData, "scripture_reference") || null,
    description: trimmed(formData, "description") || null,
    facebook_url: parsed.url,
    embed_url: parsed.embedUrl ?? null,
    published,
  };

  const { error } = id
    ? await supabase.from("sermons").update(record).eq("id", id)
    : await supabase.from("sermons").insert(record);

  if (error) return { status: "error", message: SAVE_ERROR };

  refreshPublicPages();
  redirect(`/admin/sermons?saved=${published ? "published" : "draft"}`);
}

export async function deleteSermon(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = trimmed(formData, "id");
  if (id) {
    await supabase.from("sermons").delete().eq("id", id);
    refreshPublicPages();
  }
  redirect("/admin/sermons?deleted=1");
}

/** Mark one sermon as featured and clear the flag everywhere else. */
export async function featureSermon(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = trimmed(formData, "id");
  if (id) {
    await supabase
      .from("sermons")
      .update({ is_featured: false })
      .eq("is_featured", true);
    await supabase.from("sermons").update({ is_featured: true }).eq("id", id);
    refreshPublicPages();
  }
  redirect("/admin/sermons?featured=1");
}

// ------------------------------------------------------------------ Settings

export async function saveSettings(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await requireAdmin();

  const record = {
    id: 1,
    church_name: trimmed(formData, "church_name"),
    pastor_name: trimmed(formData, "pastor_name"),
    phone: trimmed(formData, "phone") || null,
    email: trimmed(formData, "email") || null,
    address_line1: trimmed(formData, "address_line1"),
    address_line2: trimmed(formData, "address_line2") || null,
    city: trimmed(formData, "city"),
    state: trimmed(formData, "state"),
    zip: trimmed(formData, "zip"),
    service_time_text: trimmed(formData, "service_time_text"),
  };

  if (!record.church_name || !record.pastor_name) {
    return {
      status: "error",
      message: "Please keep the church name and pastor name filled in.",
    };
  }
  if (!record.address_line1 || !record.city || !record.state || !record.zip) {
    return {
      status: "error",
      message: "Please keep the full church address filled in.",
    };
  }
  if (!record.service_time_text) {
    return {
      status: "error",
      message: "Please keep the service time filled in.",
    };
  }

  const { error } = await supabase.from("church_settings").upsert(record);
  if (error) return { status: "error", message: SAVE_ERROR };

  refreshPublicPages();
  return {
    status: "success",
    message: "Church information saved. The website is updated.",
  };
}

// ------------------------------------------------------------- Announcement

export async function saveAnnouncement(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await requireAdmin();

  const id = trimmed(formData, "id");
  const record = {
    message: trimmed(formData, "message"),
    link_url: trimmed(formData, "link_url") || null,
    link_label: trimmed(formData, "link_label") || null,
    starts_on: trimmed(formData, "starts_on") || null,
    ends_on: trimmed(formData, "ends_on") || null,
    is_active: formData.get("is_active") === "on",
  };

  if (record.is_active && !record.message) {
    return {
      status: "error",
      message: "Please write the announcement text before turning it on.",
    };
  }

  const { error } = id
    ? await supabase.from("announcements").update(record).eq("id", id)
    : await supabase.from("announcements").insert(record);

  if (error) return { status: "error", message: SAVE_ERROR };

  refreshPublicPages();
  return {
    status: "success",
    message: record.is_active
      ? "Announcement saved and showing on the website."
      : "Announcement saved. It is currently turned off.",
  };
}

// ----------------------------------------------------- Inbox (private items)

type InboxTable = "prayer_requests" | "contact_messages" | "welcome_cards";

const INBOX_TABLES: InboxTable[] = [
  "prayer_requests",
  "contact_messages",
  "welcome_cards",
];

export async function toggleInboxRead(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const table = trimmed(formData, "table") as InboxTable;
  const id = trimmed(formData, "id");
  const isRead = formData.get("is_read") === "true";
  if (INBOX_TABLES.includes(table) && id) {
    await supabase.from(table).update({ is_read: !isRead }).eq("id", id);
    revalidatePath("/admin/prayer-requests");
    revalidatePath("/admin/messages");
  }
}

export async function deleteInboxItem(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const table = trimmed(formData, "table") as InboxTable;
  const id = trimmed(formData, "id");
  if (INBOX_TABLES.includes(table) && id) {
    await supabase.from(table).delete().eq("id", id);
    revalidatePath("/admin/prayer-requests");
    revalidatePath("/admin/messages");
  }
}
