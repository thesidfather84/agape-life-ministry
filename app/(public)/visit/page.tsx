import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  HandHeart,
  HeartHandshake,
  MapPin,
  Smile,
} from "lucide-react";
import MapSection from "@/components/site/MapSection";
import ImNewForm from "@/components/forms/ImNewForm";
import { Section, SectionHeading } from "@/components/ui/Section";
import { CHURCH, MAPS, SITE_URL } from "@/lib/site";
import { btn } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Visit Us",
  description: `Plan your visit to ${CHURCH.name}: Sunday worship every Sunday at 9:00 AM CST at ${CHURCH.addressLine1}, ${CHURCH.addressLine2}, New Orleans, LA ${CHURCH.zip}. What to expect, directions, and a welcome for first-time guests.`,
  alternates: { canonical: `${SITE_URL}/visit` },
  openGraph: {
    title: `Visit Us | ${CHURCH.name}`,
    description: `Sunday worship every Sunday at 9:00 AM CST. ${CHURCH.addressLine1}, ${CHURCH.addressLine2}, New Orleans, LA ${CHURCH.zip}. Everyone is welcome.`,
    url: `${SITE_URL}/visit`,
  },
};

const placeOfWorshipJsonLd = {
  "@context": "https://schema.org",
  "@type": "PlaceOfWorship",
  name: CHURCH.name,
  url: `${SITE_URL}/visit`,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${CHURCH.addressLine1}, ${CHURCH.addressLine2}`,
    addressLocality: CHURCH.city,
    addressRegion: CHURCH.state,
    postalCode: CHURCH.zip,
    addressCountry: "US",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "https://schema.org/Sunday",
    opens: "09:00",
  },
};

const EXPECT = [
  {
    icon: Smile,
    title: "A Welcoming, Relaxed Atmosphere",
    text: "Come as you are — there is no dress code and no pressure. You'll be greeted warmly, never singled out.",
  },
  {
    icon: HandHeart,
    title: "Worship & Prayer",
    text: "We lift our hearts together in worship and take time to pray — for one another and for our city.",
  },
  {
    icon: BookOpen,
    title: "Biblical Teaching",
    text: "A clear, encouraging message from God's Word that you can carry into your week.",
  },
  {
    icon: HeartHandshake,
    title: "All Are Welcome",
    text: "Wherever you are in your faith journey, there is a place for you here.",
  },
] as const;

export default function VisitPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(placeOfWorshipJsonLd),
        }}
      />

      <section className="hero-light text-cream-50">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="mb-3 text-sm font-semibold tracking-[0.25em] text-gold-300 uppercase">
            Plan Your Visit
          </p>
          <h1 className="font-serif text-4xl font-semibold sm:text-5xl">
            We Can&apos;t Wait to Meet You
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-midnight-100">
            Your first visit to a new church can feel like a big step. Here is
            everything you need to feel at home before you arrive.
          </p>

          <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center justify-center gap-4 rounded-2xl border border-cream-50/15 bg-midnight-900/50 px-6 py-5 text-left backdrop-blur sm:flex-row sm:gap-10">
            <p className="flex items-center gap-3">
              <Clock className="h-6 w-6 shrink-0 text-gold-400" aria-hidden />
              <span>
                <span className="block font-semibold">Service begins</span>
                <span className="text-midnight-100">9:00 AM CST · Every Sunday</span>
              </span>
            </p>
            <p className="flex items-center gap-3">
              <MapPin className="h-6 w-6 shrink-0 text-gold-400" aria-hidden />
              <span>
                <span className="block font-semibold">
                  {CHURCH.addressLine1}, {CHURCH.addressLine2}
                </span>
                <span className="text-midnight-100">
                  {CHURCH.city}, {CHURCH.state} {CHURCH.zip}
                </span>
              </span>
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={MAPS.directions}
              target="_blank"
              rel="noopener noreferrer"
              className={btn.gold}
            >
              Get Directions
            </a>
            <Link href="/contact" className={btn.outlineLight}>
              Contact the Church
            </Link>
          </div>
        </div>
      </section>

      <Section tone="white">
        <SectionHeading eyebrow="Your First Visit" title="What to Expect" />
        <div className="grid gap-6 sm:grid-cols-2">
          {EXPECT.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-3xl border border-cream-300 bg-cream-100 p-8 shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-royal-100">
                <Icon className="h-6 w-6 text-royal-700" aria-hidden />
              </div>
              <h2 className="font-serif text-xl font-semibold text-midnight-900">
                {title}
              </h2>
              <p className="mt-2 text-midnight-700">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading
          eyebrow="Find Us"
          title="Map & Directions"
          intro={`${CHURCH.addressLine1}, ${CHURCH.addressLine2}, ${CHURCH.city}, ${CHURCH.state} ${CHURCH.zip}`}
        />
        <MapSection />
      </Section>

      <Section tone="royal">
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            eyebrow="I'm New"
            title="Say Hello Before You Arrive"
            intro="Planning a first visit? Introduce yourself — we'd love to welcome you personally, and we can answer any questions before Sunday."
          />
          <div className="rounded-3xl border border-royal-200 bg-white p-7 shadow-sm sm:p-9">
            <ImNewForm />
          </div>
        </div>
      </Section>
    </>
  );
}
