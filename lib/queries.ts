import { createPublicClient } from "./supabase/public";
import { todayInChicago } from "./format";
import {
  FALLBACK_DAILY_WORD,
  FALLBACK_SETTINGS,
  sundayWorshipEvent,
} from "./fallback";
import type {
  Announcement,
  ChurchEvent,
  ChurchSettings,
  DailyWord,
} from "./types";

/** Latest published Daily Word (never later than today). */
export async function getLatestDailyWord(): Promise<DailyWord> {
  const supabase = createPublicClient();
  if (!supabase) return FALLBACK_DAILY_WORD;
  const { data, error } = await supabase
    .from("daily_words")
    .select("*")
    .eq("status", "published")
    .lte("word_date", todayInChicago())
    .order("word_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return FALLBACK_DAILY_WORD;
  return data as DailyWord;
}

export async function getDailyWordArchive(): Promise<DailyWord[]> {
  const supabase = createPublicClient();
  if (!supabase) return [FALLBACK_DAILY_WORD];
  const { data, error } = await supabase
    .from("daily_words")
    .select("*")
    .eq("status", "published")
    .lte("word_date", todayInChicago())
    .order("word_date", { ascending: false })
    .limit(100);
  if (error || !data || data.length === 0) return [FALLBACK_DAILY_WORD];
  return data as DailyWord[];
}

export async function getDailyWordById(id: string): Promise<DailyWord | null> {
  if (id === FALLBACK_DAILY_WORD.id) return FALLBACK_DAILY_WORD;
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("daily_words")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  return data as DailyWord;
}

/** Next `limit` published upcoming events; Sunday Worship if none. */
export async function getUpcomingEvents(limit = 3): Promise<ChurchEvent[]> {
  const supabase = createPublicClient();
  if (!supabase) return [sundayWorshipEvent()];
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .gte("event_date", todayInChicago())
    .order("event_date", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(limit);
  if (error || !data || data.length === 0) return [sundayWorshipEvent()];
  return data as ChurchEvent[];
}

export async function getPastEvents(limit = 12): Promise<ChurchEvent[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .lt("event_date", todayInChicago())
    .order("event_date", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data as ChurchEvent[];
}

export async function getChurchSettings(): Promise<ChurchSettings> {
  const supabase = createPublicClient();
  if (!supabase) return FALLBACK_SETTINGS;
  const { data, error } = await supabase
    .from("church_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) return FALLBACK_SETTINGS;
  return data as ChurchSettings;
}

/** The active announcement banner, if one is currently running. */
export async function getActiveAnnouncement(): Promise<Announcement | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;
  const today = todayInChicago();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_active", true)
    .or(`starts_on.is.null,starts_on.lte.${today}`)
    .or(`ends_on.is.null,ends_on.gte.${today}`)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return data as Announcement;
}
