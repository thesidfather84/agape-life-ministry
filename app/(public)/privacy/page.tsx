import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { CHURCH, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${CHURCH.name} handles the information you share with us.`,
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <Section tone="white">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h1 className="font-serif text-4xl font-semibold text-midnight-900">
            Privacy Policy
          </h1>
          <p className="mt-3 text-midnight-700">
            {CHURCH.name} respects you and the information you choose to share
            with us. This page explains, in plain language, what we collect and
            how we use it.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-semibold text-midnight-900">
            What we collect
          </h2>
          <p className="text-midnight-800">
            We only collect information you choose to send us through this
            website: prayer requests, contact messages, first-time visitor
            cards, and text message signups. Providing your name or contact
            details is optional wherever the form says so.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-semibold text-midnight-900">
            How we use it
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-midnight-800">
            <li>
              Prayer requests are read only by church leadership and are never
              published or shared publicly. Requests marked confidential are
              seen only by the pastor.
            </li>
            <li>
              Contact messages and visitor cards are used solely to respond to
              you.
            </li>
            <li>
              Text message signups are stored so we can send encouragement and
              scripture once our messaging service launches. We will never
              sell or share your number. You can ask to be removed at any
              time.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-semibold text-midnight-900">
            What we don&apos;t do
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-midnight-800">
            <li>We do not sell or rent your information to anyone.</li>
            <li>We do not use advertising trackers on this website.</li>
            <li>We do not publish anything you send us through a form.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-semibold text-midnight-900">
            Questions or removal requests
          </h2>
          <p className="text-midnight-800">
            If you would like your information updated or removed, contact the
            church through the{" "}
            <a href="/contact" className="font-semibold text-royal-700 underline underline-offset-4">
              contact page
            </a>{" "}
            or speak with us on Sunday, and we will take care of it.
          </p>
        </section>
      </div>
    </Section>
  );
}
