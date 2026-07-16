import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import DailyWordCard from "@/components/daily-word/DailyWordCard";
import { Section } from "@/components/ui/Section";
import { getDailyWordById } from "@/lib/queries";
import { formatDateShort } from "@/lib/format";
import { CHURCH, SITE_URL } from "@/lib/site";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const word = await getDailyWordById(id);
  if (!word) return { title: "Daily Word" };
  return {
    title: `${word.title} — Daily Word for ${formatDateShort(word.word_date)}`,
    description: `"${word.scripture_text}" — ${word.scripture_reference}. A Daily Word from ${CHURCH.name}.`,
    alternates: { canonical: `${SITE_URL}/daily-word/${word.id}` },
    openGraph: {
      title: `${word.title} | Daily Word | ${CHURCH.name}`,
      description: `"${word.scripture_text}" — ${word.scripture_reference}`,
      url: `${SITE_URL}/daily-word/${word.id}`,
      type: "article",
    },
  };
}

export default async function DailyWordDetailPage({ params }: Props) {
  const { id } = await params;
  const word = await getDailyWordById(id);
  if (!word) notFound();

  return (
    <Section tone="white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/daily-word"
          className="mb-6 inline-flex items-center gap-2 font-semibold text-royal-700 hover:text-royal-600"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All Daily Words
        </Link>
        <DailyWordCard word={word} />
      </div>
    </Section>
  );
}
