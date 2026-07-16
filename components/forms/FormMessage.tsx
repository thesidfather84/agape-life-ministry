import { CircleAlert, HeartHandshake } from "lucide-react";
import type { FormState } from "@/lib/form-state";

export default function FormMessage({ state }: { state: FormState }) {
  if (state.status === "error") {
    return (
      <p
        role="alert"
        className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800"
      >
        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        {state.message}
      </p>
    );
  }
  if (state.status === "success") {
    return (
      <p
        role="status"
        className="flex items-start gap-2.5 rounded-xl border border-gold-200 bg-gold-50 p-4 font-medium text-midnight-900"
      >
        <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden />
        {state.message}
      </p>
    );
  }
  return null;
}

/** Hidden honeypot field — humans never see or fill it. */
export function HoneypotField() {
  return (
    <div className="hidden" aria-hidden="true">
      <label>
        Leave this field empty
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
