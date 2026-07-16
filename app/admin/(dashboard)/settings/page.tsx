import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { FALLBACK_SETTINGS } from "@/lib/fallback";
import SettingsForm from "@/components/admin/SettingsForm";
import type { ChurchSettings } from "@/lib/types";

export default async function AdminSettingsPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("church_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  const settings = (data as ChurchSettings | null) ?? FALLBACK_SETTINGS;

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
        Edit Church Information
      </h1>
      <p className="mb-8 text-midnight-700">
        This information appears on the website — the contact page, the
        footer, and anywhere the address or service time is shown.
      </p>
      <SettingsForm settings={settings} />
    </>
  );
}
