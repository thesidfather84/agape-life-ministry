import Link from "next/link";

export default function NotFound() {
  return (
    <main className="hero-light flex flex-1 flex-col items-center justify-center px-4 py-24 text-center text-cream-50">
      <p className="text-sm font-semibold tracking-[0.25em] text-gold-300 uppercase">
        Page not found
      </p>
      <h1 className="mt-4 font-serif text-4xl font-semibold">
        This page seems to have wandered off
      </h1>
      <p className="mx-auto mt-4 max-w-md text-midnight-100">
        The page you&apos;re looking for doesn&apos;t exist — but you are
        always welcome here.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-12 items-center rounded-full bg-gold-400 px-7 py-3 font-semibold text-midnight-950 transition-colors hover:bg-gold-300"
      >
        Return Home
      </Link>
    </main>
  );
}
