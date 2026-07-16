import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import DailyWordForm from "@/components/admin/DailyWordForm";
import type { DailyWord } from "@/lib/types";

export default async function EditDailyWordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("daily_words")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <>
      <Link
        href="/admin/daily-word"
        className="mb-6 inline-flex items-center gap-2 font-semibold text-royal-700 hover:text-royal-600"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All Daily Word posts
      </Link>
      <h1 className="mb-8 font-serif text-3xl font-semibold text-midnight-900">
        Edit Daily Word
      </h1>
      <DailyWordForm word={data as DailyWord} />
    </>
  );
}
