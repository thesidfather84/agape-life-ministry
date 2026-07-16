import { CircleCheck } from "lucide-react";

/** Friendly confirmation banner shown after a save or delete. */
export default function SavedBanner({ text }: { text: string }) {
  return (
    <p
      role="status"
      className="mb-6 flex items-center gap-2.5 rounded-2xl border border-gold-200 bg-gold-50 p-4 font-medium text-midnight-900"
    >
      <CircleCheck className="h-5 w-5 shrink-0 text-gold-600" aria-hidden />
      {text}
    </p>
  );
}
