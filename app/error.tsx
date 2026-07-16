"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-cream-50 px-4 py-24 text-center">
      <h1 className="font-serif text-3xl font-semibold text-midnight-900">
        Something went wrong
      </h1>
      <p className="mx-auto mt-4 max-w-md text-midnight-700">
        We&apos;re sorry — an unexpected error occurred. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex min-h-12 items-center rounded-full bg-royal-600 px-7 py-3 font-semibold text-white transition-colors hover:bg-royal-500"
      >
        Try Again
      </button>
    </main>
  );
}
