import { CHURCH, FULL_ADDRESS } from "./site";
import { nextSundayInChicago, todayInChicago } from "./format";
import type { ChurchEvent, ChurchSettings, DailyWord } from "./types";

/**
 * Built-in sample content shown before Supabase is connected or if a
 * read ever fails. Scripture below is quoted, not generated: the verse
 * text was supplied with the project brief (1 Corinthians 16:14).
 */
export const FALLBACK_DAILY_WORD: DailyWord = {
  id: "sample-daily-word",
  word_date: todayInChicago(),
  scripture_reference: "1 Corinthians 16:14",
  scripture_text: "Let all that you do be done in love.",
  title: "Welcome to the Daily Word",
  message:
    "This is a sample post. Once the church website is connected and the pastor signs in to the admin area, each day's scripture and message will appear here. (Sample content — replace it from the admin area.)",
  prayer: null,
  status: "published",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/** Standing Sunday Worship event, used when no special events are posted. */
export function sundayWorshipEvent(): ChurchEvent {
  return {
    id: "sunday-worship",
    title: "Sunday Worship Service",
    event_date: nextSundayInChicago(),
    start_time: "09:00",
    end_time: null,
    location: FULL_ADDRESS,
    description:
      "Join us for worship, prayer, and Biblical teaching. Everyone is welcome — come as you are.",
    image_url: null,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export const FALLBACK_SETTINGS: ChurchSettings = {
  id: 1,
  church_name: CHURCH.name,
  pastor_name: CHURCH.pastor,
  phone: null,
  email: null,
  address_line1: CHURCH.addressLine1,
  address_line2: CHURCH.addressLine2,
  city: CHURCH.city,
  state: CHURCH.state,
  zip: CHURCH.zip,
  service_time_text: CHURCH.serviceTime,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
