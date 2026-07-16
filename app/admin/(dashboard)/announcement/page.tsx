import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import AnnouncementForm from "@/components/admin/AnnouncementForm";
import type { Announcement } from "@/lib/types";

export default async function AdminAnnouncementPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

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
        Homepage Announcement
      </h1>
      <p className="mb-8 max-w-2xl text-midnight-700">
        Use this for anything the congregation should see right away — a
        service change, special prayer meeting, holiday service, community
        event, or weather notice. Turn it on when you need it and off when
        you&apos;re done.
      </p>
      <AnnouncementForm announcement={data as Announcement | null} />
    </>
  );
}
