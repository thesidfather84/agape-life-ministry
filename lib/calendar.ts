import type { ChurchEvent } from "./types";

function toCalendarStamp(isoDate: string, time: string | null): string {
  const date = isoDate.replace(/-/g, "");
  const t = (time ?? "09:00").slice(0, 5).replace(":", "");
  return `${date}T${t}00`;
}

/**
 * Google Calendar "add event" link. Uses the event's local (church)
 * time zone so the entry lands at the right hour for attendees.
 */
export function googleCalendarUrl(event: ChurchEvent): string {
  const start = toCalendarStamp(event.event_date, event.start_time);
  // Default to one hour after start when no end time is provided.
  let end: string;
  if (event.end_time) {
    end = toCalendarStamp(event.event_date, event.end_time);
  } else {
    const startHour = Number((event.start_time ?? "09:00").slice(0, 2));
    const endHour = String(Math.min(startHour + 1, 23)).padStart(2, "0");
    end = toCalendarStamp(
      event.event_date,
      `${endHour}:${(event.start_time ?? "09:00").slice(3, 5)}`
    );
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description,
    location: event.location,
    ctz: "America/Chicago",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
