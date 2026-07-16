/** Shared button styles so every call-to-action feels consistent. */
export const btn = {
  gold: "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold-400 px-7 py-3 text-base font-semibold text-midnight-950 shadow-sm transition-colors hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-60",
  outlineLight:
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-cream-50/70 px-7 py-3 text-base font-semibold text-cream-50 transition-colors hover:border-gold-300 hover:text-gold-300",
  outlineDark:
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-midnight-600 px-7 py-3 text-base font-semibold text-midnight-800 transition-colors hover:border-royal-500 hover:text-royal-700",
  royal:
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-royal-600 px-7 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-royal-500 disabled:cursor-not-allowed disabled:opacity-60",
  subtle:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-midnight-50 px-5 py-2.5 text-sm font-semibold text-midnight-800 transition-colors hover:bg-midnight-100",
} as const;

/** Shared form field styles. */
export const field =
  "block w-full rounded-xl border border-midnight-200 bg-white px-4 py-3 text-base text-midnight-900 placeholder:text-midnight-500/60 focus:border-royal-500";

export const label = "mb-1.5 block text-sm font-semibold text-midnight-800";
