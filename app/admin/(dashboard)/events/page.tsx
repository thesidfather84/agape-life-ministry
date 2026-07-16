import Link from "next/link";
import { Plus } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { formatDate, formatTime } from "@/lib/format";
import { deleteEvent } from "@/app/actions/admin";
import DeleteButton from "@/components/admin/DeleteButton";
import SavedBanner from "@/components/admin/SavedBanner";
import type { ChurchEvent } from "@/lib/types";

export default async function AdminEventsList({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false })
    .limit(200);
  const events = (data ?? []) as ChurchEvent[];

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-midnight-900">
            Church Events
          </h1>
          <p className="mt-1 text-midnight-700">
            Everything on the church calendar.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-royal-600 px-6 py-3 font-semibold text-white hover:bg-royal-500"
        >
          <Plus className="h-5 w-5" aria-hidden />
          Add an Event
        </Link>
      </div>

      {saved && <SavedBanner text="The event has been saved." />}
      {deleted && <SavedBanner text="The event has been deleted." />}

      {events.length === 0 ? (
        <p className="rounded-3xl border border-cream-300 bg-white p-8 text-center text-midnight-700">
          No events yet. Tap &ldquo;Add an Event&rdquo; to put something on
          the calendar. Until then, the website shows Sunday Worship as the
          standing event.
        </p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-cream-300 bg-white p-5"
            >
              <div>
                <p className="font-semibold text-midnight-900">{event.title}</p>
                <p className="text-sm text-midnight-700">
                  {formatDate(event.event_date)} ·{" "}
                  {formatTime(event.start_time)}
                  {event.end_time && ` – ${formatTime(event.end_time)}`} ·{" "}
                  {event.status === "published" ? (
                    <span className="font-semibold text-royal-700">
                      Published
                    </span>
                  ) : (
                    <span className="font-semibold text-gold-700">Draft</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/events/${event.id}`}
                  className="inline-flex min-h-10 items-center rounded-full bg-midnight-50 px-5 py-2 text-sm font-semibold text-midnight-800 hover:bg-midnight-100"
                >
                  Edit
                </Link>
                <DeleteButton action={deleteEvent} id={event.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
