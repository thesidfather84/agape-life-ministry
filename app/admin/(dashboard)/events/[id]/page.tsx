import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import EventForm from "@/components/admin/EventForm";
import type { ChurchEvent } from "@/lib/types";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <>
      <Link
        href="/admin/events"
        className="mb-6 inline-flex items-center gap-2 font-semibold text-royal-700 hover:text-royal-600"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All events
      </Link>
      <h1 className="mb-8 font-serif text-3xl font-semibold text-midnight-900">
        Edit Event
      </h1>
      <EventForm event={data as ChurchEvent} />
    </>
  );
}
