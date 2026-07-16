import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone, UserRound } from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getChurchSettings } from "@/lib/queries";
import { CHURCH, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${CHURCH.name} in New Orleans, LA — questions, prayer, or planning a visit. Sunday worship every Sunday at 9:00 AM CST.`,
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: `Contact | ${CHURCH.name}`,
    description:
      "Reach out with questions, prayer needs, or to plan a visit. We would love to hear from you.",
    url: `${SITE_URL}/contact`,
  },
};

export default async function ContactPage() {
  const settings = await getChurchSettings();

  return (
    <>
      <section className="hero-light text-cream-50">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="mb-3 text-sm font-semibold tracking-[0.25em] text-gold-300 uppercase">
            Get in Touch
          </p>
          <h1 className="font-serif text-4xl font-semibold sm:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-midnight-100">
            Questions, prayer, or planning a visit — we would love to hear from
            you.
          </p>
        </div>
      </section>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-2">
            <h2 className="font-serif text-2xl font-semibold text-midnight-900">
              {settings.church_name}
            </h2>
            <p className="flex items-start gap-3 text-midnight-800">
              <UserRound className="mt-1 h-5 w-5 shrink-0 text-royal-600" aria-hidden />
              {settings.pastor_name}
            </p>
            <p className="flex items-start gap-3 text-midnight-800">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-royal-600" aria-hidden />
              <span>
                {settings.address_line1}
                {settings.address_line2 && (
                  <>
                    , {settings.address_line2}
                  </>
                )}
                <br />
                {settings.city}, {settings.state} {settings.zip}
              </span>
            </p>
            <p className="flex items-start gap-3 text-midnight-800">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-royal-600" aria-hidden />
              {settings.service_time_text}
            </p>
            <p className="flex items-start gap-3 text-midnight-800">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-royal-600" aria-hidden />
              {settings.phone ? (
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="hover:text-royal-700">
                  {settings.phone}
                </a>
              ) : (
                <span className="text-midnight-600 italic">
                  Phone number coming soon
                </span>
              )}
            </p>
            <p className="flex items-start gap-3 text-midnight-800">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-royal-600" aria-hidden />
              {settings.email ? (
                <a href={`mailto:${settings.email}`} className="hover:text-royal-700">
                  {settings.email}
                </a>
              ) : (
                <span className="text-midnight-600 italic">
                  Email address coming soon
                </span>
              )}
            </p>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-cream-300 bg-cream-100 p-7 shadow-sm sm:p-9">
              <SectionHeading title="Send Us a Message" />
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
