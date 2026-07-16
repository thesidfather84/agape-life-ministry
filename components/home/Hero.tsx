import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { CHURCH, MAPS } from "@/lib/site";
import { btn } from "@/lib/ui";

export default function Hero() {
  return (
    <section className="hero-light relative overflow-hidden text-cream-50">
      {/* Gentle drifting glow, disabled automatically for reduced motion */}
      <div
        aria-hidden
        className="animate-glow-drift pointer-events-none absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-royal-500/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <p className="animate-fade-rise mb-4 text-sm font-semibold tracking-[0.25em] text-gold-300 uppercase">
          {CHURCH.name} · New Orleans
        </p>
        <h1 className="animate-fade-rise mx-auto max-w-3xl font-serif text-4xl leading-tight font-semibold sm:text-5xl md:text-6xl">
          Experience the Unconditional Love of God
        </h1>
        <p className="animate-fade-rise mx-auto mt-6 max-w-2xl text-lg text-midnight-100 sm:text-xl">
          Agape Life Ministry is a welcoming place to worship, grow in faith,
          find encouragement, and experience the love of God that remains
          through every circumstance.
        </p>

        <div className="animate-fade-rise mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/visit" className={btn.gold}>
            Join Us Sunday
          </Link>
          <a
            href={MAPS.directions}
            target="_blank"
            rel="noopener noreferrer"
            className={btn.outlineLight}
          >
            Get Directions
          </a>
        </div>

        <div className="animate-fade-rise mx-auto mt-12 flex max-w-2xl flex-col items-center justify-center gap-4 rounded-2xl border border-cream-50/15 bg-midnight-900/50 px-6 py-5 text-left backdrop-blur sm:flex-row sm:gap-10">
          <p className="flex items-center gap-3">
            <Clock className="h-6 w-6 shrink-0 text-gold-400" aria-hidden />
            <span>
              <span className="block font-semibold text-cream-50">
                {CHURCH.serviceDay}
              </span>
              <span className="text-midnight-100">{CHURCH.serviceTime}</span>
            </span>
          </p>
          <p className="flex items-center gap-3">
            <MapPin className="h-6 w-6 shrink-0 text-gold-400" aria-hidden />
            <span>
              <span className="block font-semibold text-cream-50">
                {CHURCH.addressLine1}, {CHURCH.addressLine2}
              </span>
              <span className="text-midnight-100">
                {CHURCH.city}, {CHURCH.state} {CHURCH.zip}
              </span>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
