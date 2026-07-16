import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { btn } from "@/lib/ui";

export default function AboutAgape() {
  return (
    <Section tone="royal">
      <SectionHeading eyebrow="Our Name" title="What Is Agape Love?" />
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-lg text-midnight-800">
          <em>Agape</em> is the highest form of love described in the Bible:
          selfless, sacrificial, faithful, and unconditional. It is the love
          God has for humanity — a love that does not depend on what we have
          done or where we have been — and the love we return to Him and share
          with one another.
        </p>
        <blockquote className="mx-auto mt-10 max-w-xl rounded-3xl border border-royal-200 bg-white p-8 shadow-sm">
          <p className="font-serif text-2xl text-midnight-900">
            &ldquo;Let all that you do be done in love.&rdquo;
          </p>
          <cite className="mt-3 block text-sm font-semibold tracking-wide text-royal-700 not-italic">
            1 Corinthians 16:14
          </cite>
        </blockquote>
        <div className="mt-10">
          <Link href="/about" className={btn.royal}>
            Learn More About Us
          </Link>
        </div>
      </div>
    </Section>
  );
}
