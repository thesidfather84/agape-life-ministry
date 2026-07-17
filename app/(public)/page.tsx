import Link from "next/link";
import { ArrowRight, HeartHandshake, Mail } from "lucide-react";
import Hero from "@/components/home/Hero";
import Welcome from "@/components/home/Welcome";
import AboutAgape from "@/components/home/AboutAgape";
import LatestSermon from "@/components/home/LatestSermon";
import MomentOfPeace from "@/components/home/MomentOfPeace";
import DailyWordCard from "@/components/daily-word/DailyWordCard";
import EventCard from "@/components/events/EventCard";
import MapSection from "@/components/site/MapSection";
import PrayerRequestForm from "@/components/forms/PrayerRequestForm";
import SmsSignupForm from "@/components/forms/SmsSignupForm";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getLatestDailyWord, getUpcomingEvents } from "@/lib/queries";
import { CHURCH } from "@/lib/site";
import { btn } from "@/lib/ui";

export default async function HomePage() {
  const [dailyWord, events] = await Promise.all([
    getLatestDailyWord(),
    getUpcomingEvents(3),
  ]);

  return (
    <>
      <Hero />
      <Welcome />
      <AboutAgape />

      <Section tone="cream" id="daily-word">
        <SectionHeading
          eyebrow="Encouragement for Today"
          title="Today's Daily Word"
          intro="A scripture and a short message from the pastor to carry with you through the day."
        />
        <DailyWordCard word={dailyWord} featured />
        <p className="mt-8 text-center">
          <Link
            href="/daily-word"
            className="inline-flex items-center gap-2 font-semibold text-royal-700 hover:text-royal-600"
          >
            Browse previous Daily Words
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </p>
      </Section>

      <LatestSermon />

      <Section tone="white" id="events">
        <SectionHeading
          eyebrow="What's Happening"
          title="Upcoming Events"
          intro="Join us — everyone is welcome at everything we do."
        />
        <div
          className={`grid gap-6 ${
            events.length > 1 ? "md:grid-cols-2 lg:grid-cols-3" : "mx-auto max-w-xl"
          }`}
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 font-semibold text-royal-700 hover:text-royal-600"
          >
            See all events
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </p>
      </Section>

      <Section tone="cream" id="visit">
        <SectionHeading
          eyebrow="Plan Your Visit"
          title="We Would Love to See You Sunday"
          intro={`Service begins at 9:00 AM CST every Sunday. Come as you are — expect a welcoming, relaxed atmosphere with worship, prayer, and Biblical teaching.`}
        />
        <MapSection />
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/visit" className={btn.gold}>
            Plan Your Visit
          </Link>
          <Link href="/contact" className={btn.outlineDark}>
            Contact the Church
          </Link>
        </div>
      </Section>

      <Section tone="midnight">
        <SectionHeading
          eyebrow="A Moment of Peace"
          title="Be Still for Sixty Seconds"
          intro="Wherever you are right now, take a short, quiet pause."
          onDark
        />
        <MomentOfPeace />
      </Section>

      <Section tone="royal" id="prayer">
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            eyebrow="We Will Pray With You"
            title="Send a Prayer Request"
            intro="Whatever you are carrying, you don't have to carry it alone. Share your request and our church will lift it up in prayer."
          />
          <div className="rounded-3xl border border-royal-200 bg-white p-7 shadow-sm sm:p-9">
            <PrayerRequestForm />
          </div>
        </div>
      </Section>

      <Section tone="white">
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            eyebrow="Stay Encouraged"
            title="Scripture by Text Message"
            intro="Receive encouragement and scripture from Agape Life Ministry."
          />
          <div className="rounded-3xl border border-cream-300 bg-cream-100 p-7 shadow-sm sm:p-9">
            <SmsSignupForm />
          </div>
        </div>
      </Section>

      <Section tone="cream">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <HeartHandshake className="h-10 w-10 text-royal-600" aria-hidden />
          <h2 className="font-serif text-3xl font-semibold text-midnight-900">
            Questions? We&apos;re Here for You.
          </h2>
          <p className="text-lg text-midnight-700">
            Reach out to {CHURCH.name} any time — about visiting, prayer, or
            anything on your heart.
          </p>
          <Link href="/contact" className={btn.royal}>
            <Mail className="h-5 w-5" aria-hidden />
            Contact Us
          </Link>
        </div>
      </Section>
    </>
  );
}
