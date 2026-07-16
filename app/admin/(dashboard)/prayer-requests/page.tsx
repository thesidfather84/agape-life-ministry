import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import InboxControls from "@/components/admin/InboxControls";
import type { PrayerRequest } from "@/lib/types";

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminPrayerRequestsPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("prayer_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  const requests = (data ?? []) as PrayerRequest[];

  return (
    <>
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-2 font-semibold text-royal-700 hover:text-royal-600"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to dashboard
      </Link>
      <h1 className="mb-2 font-serif text-3xl font-semibold text-midnight-900">
        Prayer Requests
      </h1>
      <p className="mb-8 text-midnight-700">
        These are private. Only signed-in church administrators can see them.
      </p>

      {requests.length === 0 ? (
        <p className="rounded-3xl border border-cream-300 bg-white p-8 text-center text-midnight-700">
          No prayer requests yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li
              key={request.id}
              className={`rounded-3xl border p-6 ${
                request.is_read
                  ? "border-cream-300 bg-cream-100"
                  : "border-gold-300 bg-white shadow-sm"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-midnight-900">
                  {request.name || "Someone (no name given)"}
                  {request.confidential && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-royal-100 px-2.5 py-0.5 text-xs font-semibold text-royal-800">
                      <Lock className="h-3 w-3" aria-hidden />
                      Confidential
                    </span>
                  )}
                  {!request.is_read && (
                    <span className="ml-2 rounded-full bg-gold-400 px-2.5 py-0.5 text-xs font-bold text-midnight-950">
                      New
                    </span>
                  )}
                </p>
                <p className="text-sm text-midnight-600">
                  {formatWhen(request.created_at)}
                </p>
              </div>
              {request.contact && (
                <p className="mt-1 text-sm text-midnight-700">
                  Reach them at: {request.contact}
                </p>
              )}
              <p className="mt-4 whitespace-pre-line text-midnight-800">
                {request.request}
              </p>
              <div className="mt-5">
                <InboxControls
                  table="prayer_requests"
                  id={request.id}
                  isRead={request.is_read}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
