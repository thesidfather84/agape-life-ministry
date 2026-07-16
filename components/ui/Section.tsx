import type { ReactNode } from "react";

export function Section({
  id,
  children,
  tone = "cream",
  className = "",
}: {
  id?: string;
  children: ReactNode;
  tone?: "cream" | "white" | "midnight" | "royal";
  className?: string;
}) {
  const tones: Record<string, string> = {
    cream: "bg-cream-100",
    white: "bg-cream-50",
    midnight: "bg-midnight-950 text-cream-50",
    royal: "bg-royal-50",
  };
  return (
    <section id={id} className={`${tones[tone]} ${className}`}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  onDark = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  onDark?: boolean;
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {eyebrow && (
        <p
          className={`mb-3 text-sm font-semibold tracking-[0.2em] uppercase ${
            onDark ? "text-gold-300" : "text-royal-600"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-serif text-3xl font-semibold sm:text-4xl ${
          onDark ? "text-cream-50" : "text-midnight-900"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-4 text-lg ${
            onDark ? "text-midnight-100" : "text-midnight-700"
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
