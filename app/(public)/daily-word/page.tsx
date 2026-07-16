import type { Metadata } from "next";
import DailyWordCard from "@/components/daily-word/DailyWordCard";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getDailyWordArchive } from "@/lib/queries";
import { CHURCH, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Daily Word",
  description: `Daily scripture and devotional messages from ${CHURCH.pastor} of ${CHURCH.name}. Read today's word and browse the archive.`,
  alternates: { canonical: `${SITE_URL}/daily-word` },
  openGraph: {
    title: `Daily Word | ${CHURCH.name}`,
    description:
      "Daily scripture and devotional messages from the pastor. Read today's word and browse the archive.",
    url: `${SITE_URL}/daily-word`,
  },
};

export default async function DailyWordPage() {
  const words = await getDailyWordArchive();
  const [latest, ...previous] = words;

  return (
    <>
      <section className="hero-light text-cream-50">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="mb-3 text-sm font-semibold tracking-[0.25em] text-gold-300 uppercase">
            Encouragement for Today
          </p>
          <h1 className="font-serif text-4xl font-semibold sm:text-5xl">
            The Daily Word
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-midnight-100">
            A scripture and a short message from the pastor — posted for you,
            one day at a time.
          </p>
        </div>
      </section>

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <DailyWordCard word={latest} />
        </div>
      </Section>

      {previous.length > 0 && (
        <Section tone="cream">
          <SectionHeading eyebrow="Archive" title="Previous Daily Words" />
          <div className="mx-auto max-w-3xl space-y-8">
            {previous.map((word) => (
              <DailyWordCard key={word.id} word={word} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
