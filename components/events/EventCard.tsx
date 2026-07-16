/* eslint-disable @next/next/no-img-element */
import { CalendarPlus, Clock, MapPin, Navigation } from "lucide-react";
import type { ChurchEvent } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/format";
import { googleCalendarUrl } from "@/lib/calendar";

export default function EventCard({
  event,
  past = false,
}: {
  event: ChurchEvent;
  past?: boolean;
}) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.location)}`;
  const timeRange = event.end_time
    ? `${formatTime(event.start_time)} – ${formatTime(event.end_time)}`
    : formatTime(event.start_time);

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-cream-300 bg-white shadow-sm">
      {event.image_url && (
        <img
          src={event.image_url}
          alt=""
          loading="lazy"
          className="h-44 w-full object-cover"
        />
      )}
      <div className="flex flex-1 flex-col p-7">
        <time
          dateTime={event.event_date}
          className="text-sm font-semibold tracking-wide text-royal-700 uppercase"
        >
          {formatDate(event.event_date)}
        </time>
        <h3 className="mt-2 font-serif text-xl font-semibold text-midnight-900">
          {event.title}
        </h3>
        <p className="mt-3 flex items-center gap-2 text-sm text-midnight-700">
          <Clock className="h-4 w-4 shrink-0 text-gold-600" aria-hidden />
          {timeRange} CST
        </p>
        <p className="mt-1.5 flex items-start gap-2 text-sm text-midnight-700">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden />
          {event.location}
        </p>
        <p className="mt-4 flex-1 text-midnight-800">{event.description}</p>

        {!past && (
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={googleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-royal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-royal-500"
            >
              <CalendarPlus className="h-4 w-4" aria-hidden />
              Add to Calendar
            </a>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-midnight-50 px-5 py-2.5 text-sm font-semibold text-midnight-800 transition-colors hover:bg-midnight-100"
            >
              <Navigation className="h-4 w-4" aria-hidden />
              Get Directions
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
