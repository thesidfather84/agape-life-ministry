"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

/**
 * Two-step delete: the first tap asks for confirmation, so nothing is
 * ever removed by accident.
 */
export default function DeleteButton({
  action,
  id,
  table,
  label = "Delete",
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  table?: string;
  label?: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" aria-hidden />
        {label}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-sm font-medium text-red-800">Are you sure?</span>
      <form action={action} className="inline">
        <input type="hidden" name="id" value={id} />
        {table && <input type="hidden" name="table" value={table} />}
        <button
          type="submit"
          className="min-h-10 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
        >
          Yes, delete
        </button>
      </form>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="min-h-10 rounded-full bg-midnight-50 px-4 py-2 text-sm font-semibold text-midnight-800 hover:bg-midnight-100"
      >
        Cancel
      </button>
    </span>
  );
}
