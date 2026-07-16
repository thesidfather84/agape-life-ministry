import { HandHeart, Heart, Users } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";

const VALUES = [
  {
    icon: HandHeart,
    title: "Faith",
    text: "Growing closer to God through worship, prayer, and His Word.",
  },
  {
    icon: Heart,
    title: "Love",
    text: "Demonstrating the sacrificial and unconditional love of Christ.",
  },
  {
    icon: Users,
    title: "Community",
    text: "Supporting one another through every season of life.",
  },
] as const;

export default function Welcome() {
  return (
    <Section tone="white">
      <SectionHeading
        eyebrow="Welcome"
        title="You Are Welcome Here"
        intro="No matter where you are in life or where you are in your faith journey, there is a place for you at Agape Life Ministry. Come as you are and join a community centered on worship, prayer, truth, compassion, and the unconditional love of God."
      />
      <div className="grid gap-6 sm:grid-cols-3">
        {VALUES.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-3xl border border-cream-300 bg-cream-100 p-8 text-center shadow-sm"
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-royal-100">
              <Icon className="h-7 w-7 text-royal-700" aria-hidden />
            </div>
            <h3 className="font-serif text-xl font-semibold text-midnight-900">
              {title}
            </h3>
            <p className="mt-2 text-midnight-700">{text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
