import type { Metadata } from "next";
import Link from "next/link";
import { HandHeart, Heart, Sunrise, Users } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getChurchSettings } from "@/lib/queries";
import { CHURCH, SITE_URL } from "@/lib/site";
import { btn } from "@/lib/ui";

export const metadata: Metadata = {
  title: "About",
  description: `Learn what agape love means and what ${CHURCH.name} represents: God's unconditional love, grace, hope, restoration, and belonging. Led by ${CHURCH.pastor} in New Orleans, LA.`,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: `About | ${CHURCH.name}`,
    description:
      "What agape love means and what our ministry represents: God's unconditional love, grace, hope, restoration, and belonging.",
    url: `${SITE_URL}/about`,
  },
};

const BELIEFS = [
  {
    icon: Heart,
    title: "Unconditional Love",
    text: "Agape is the highest form of love: the sacrificial, unconditional love of God for humanity, and humanity's love for God. It is the heart of everything we do.",
  },
  {
    icon: Sunrise,
    title: "Grace & Hope",
    text: "No past is too broken and no circumstance is too heavy. We believe in spiritual restoration and in hope that holds through every season.",
  },
  {
    icon: Users,
    title: "Belonging & Community",
    text: "Church is family. We support one another in prayer, in practical ways, and in walking through life together.",
  },
  {
    icon: HandHeart,
    title: "Faith Through Everything",
    text: "Faith is not only for the easy days. We worship, pray, and stand on God's Word through difficult circumstances, together.",
  },
] as const;

export default async function AboutPage() {
  const settings = await getChurchSettings();

  return (
    <>
      <section className="hero-light text-cream-50">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="mb-3 text-sm font-semibold tracking-[0.25em] text-gold-300 uppercase">
            About Us
          </p>
          <h1 className="font-serif text-4xl font-semibold sm:text-5xl">
            What Is Agape Love?
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-midnight-100">
            <em>Agape</em> is the highest form of love: selfless, sacrificial,
            faithful, and unconditional. It is God&apos;s love for you — and it
            is the love this ministry is built on.
          </p>
        </div>
      </section>

      <Section tone="white">
        <div className="mx-auto max-w-3xl text-center">
          <blockquote className="rounded-3xl border border-cream-300 bg-cream-100 p-8 shadow-sm sm:p-10">
            <p className="font-serif text-2xl text-midnight-900 sm:text-3xl">
              &ldquo;Let all that you do be done in love.&rdquo;
            </p>
            <cite className="mt-4 block text-sm font-semibold tracking-wide text-royal-700 not-italic">
              1 Corinthians 16:14
            </cite>
          </blockquote>
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading
          eyebrow="What We Represent"
          title="The Heart of Agape Life Ministry"
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {BELIEFS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-3xl border border-cream-300 bg-white p-8 shadow-sm"
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

      <Section tone="royal">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading eyebrow="Leadership" title={settings.pastor_name} />
          <p className="text-lg text-midnight-800">
            {CHURCH.name} gathers under the leadership of{" "}
            {settings.pastor_name} for worship, prayer, and Biblical teaching
            every Sunday at 9:00 AM CST in New Orleans, Louisiana.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/visit" className={btn.gold}>
              Plan Your Visit
            </Link>
            <Link href="/contact" className={btn.outlineDark}>
              Contact Us
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
