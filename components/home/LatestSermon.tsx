import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SermonCard from "@/components/sermons/SermonCard";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getFeaturedSermon } from "@/lib/queries";
import { btn } from "@/lib/ui";

export default async function LatestSermon() {
  const sermon = await getFeaturedSermon();
  if (!sermon) return null;

  return (
    <Section tone="royal" id="sermons">
      <SectionHeading
        eyebrow="Watch"
        title="Latest Sermon"
        intro="Missed a Sunday? Catch the most recent message here."
      />
      <SermonCard sermon={sermon} featured />
      <p className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link href="/sermons" className={btn.royal}>
          View All Sermons
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </p>
    </Section>
  );
}
