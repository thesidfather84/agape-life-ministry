import type { Metadata } from "next";
import Link from "next/link";
import SermonCard from "@/components/sermons/SermonCard";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getFeaturedSermon, getSermons } from "@/lib/queries";
import { CHURCH, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sermons",
  description: `Watch sermons and messages from ${CHURCH.pastor} of ${CHURCH.name} in New Orleans, LA. New messages posted regularly.`,
  alternates: { canonical: `${SITE_URL}/sermons` },
  openGraph: {
    title: `Sermons | ${CHURCH.name}`,
    description:
      "Watch sermons and messages from the pastor. New messages posted regularly.",
    url: `${SITE_URL}/sermons`,
  },
};

export default async function SermonsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [featured, { sermons, hasMore }] = await Promise.all([
    page === 1 ? getFeaturedSermon() : Promise.resolve(null),
    getSermons(page, 12),
  ]);

  const rest = featured
    ? sermons.filter((s) => s.id !== featured.id)
    : sermons;

  return (
    <>
      <section className="hero-light text-cream-50">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="mb-3 text-sm font-semibold tracking-[0.25em] text-gold-300 uppercase">
            Watch &amp; Listen
          </p>
          <h1 className="font-serif text-4xl font-semibold sm:text-5xl">
            Sermons &amp; Messages
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-midnight-100">
            Messages of hope, grace, and the unconditional love of God —
            watch the latest sermon or browse past messages.
          </p>
        </div>
      </section>

      {featured && (
        <Section tone="white">
          <SectionHeading eyebrow="Latest Message" title="Featured Sermon" />
          <SermonCard sermon={featured} featured />
        </Section>
      )}

      <Section tone="cream">
        {rest.length > 0 && (
          <>
            <SectionHeading
              eyebrow="Archive"
              title={page === 1 ? "Previous Sermons" : `Sermons — Page ${page}`}
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>
          </>
        )}

        {!featured && rest.length === 0 && (
          <p className="mx-auto max-w-xl rounded-3xl border border-cream-300 bg-white p-8 text-center text-midnight-700">
            Sermons will appear here soon. In the meantime, join us in person
            — {CHURCH.serviceTime}.
          </p>
        )}

        {(hasMore || page > 1) && (
          <nav
            aria-label="Sermon pages"
            className="mt-10 flex items-center justify-center gap-4"
          >
            {page > 1 && (
              <Link
                href={`/sermons?page=${page - 1}`}
                className="inline-flex min-h-11 items-center rounded-full bg-midnight-50 px-6 py-2.5 font-semibold text-midnight-800 hover:bg-midnight-100"
              >
                Newer Sermons
              </Link>
            )}
            {hasMore && (
              <Link
                href={`/sermons?page=${page + 1}`}
                className="inline-flex min-h-11 items-center rounded-full bg-royal-600 px-6 py-2.5 font-semibold text-white hover:bg-royal-500"
              >
                Load More Sermons
              </Link>
            )}
          </nav>
        )}
      </Section>
    </>
  );
}
