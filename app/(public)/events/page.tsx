import type { Metadata } from "next";
import EventCard from "@/components/events/EventCard";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getPastEvents, getUpcomingEvents } from "@/lib/queries";
import { CHURCH, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events",
  description: `Upcoming worship services and events at ${CHURCH.name} in New Orleans, LA. Sunday worship every Sunday at 9:00 AM CST — everyone is welcome.`,
  alternates: { canonical: `${SITE_URL}/events` },
  openGraph: {
    title: `Events | ${CHURCH.name}`,
    description:
      "Upcoming worship services and events. Sunday worship every Sunday at 9:00 AM CST — everyone is welcome.",
    url: `${SITE_URL}/events`,
  },
};

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingEvents(24),
    getPastEvents(12),
  ]);

  return (
    <>
      <section className="hero-light text-cream-50">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="mb-3 text-sm font-semibold tracking-[0.25em] text-gold-300 uppercase">
            What&apos;s Happening
          </p>
          <h1 className="font-serif text-4xl font-semibold sm:text-5xl">
            Church Events
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-midnight-100">
            Worship services, prayer gatherings, and community events — you are
            welcome at all of them.
          </p>
        </div>
      </section>

      <Section tone="white">
        <SectionHeading eyebrow="Coming Up" title="Upcoming Events" />
        <div
          className={`grid gap-6 ${
            upcoming.length > 1
              ? "md:grid-cols-2 lg:grid-cols-3"
              : "mx-auto max-w-xl"
          }`}
        >
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </Section>

      {past.length > 0 && (
        <Section tone="cream">
          <SectionHeading eyebrow="Looking Back" title="Past Events" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <EventCard key={event.id} event={event} past />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
