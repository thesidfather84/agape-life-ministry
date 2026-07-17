import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Church } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signOutPastor } from "@/app/actions/auth";
import PastorSermonForm from "@/components/pastor/PastorSermonForm";
import PastorSermonList from "@/components/pastor/PastorSermonList";
import type { Sermon } from "@/lib/types";

export const metadata: Metadata = {
  title: "Pastor — Post a Sermon",
  robots: { index: false, follow: false },
};

export default async function PastorPage() {
  if (!isSupabaseConfigured()) redirect("/pastor-login");

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/pastor-login");

  const { data } = await supabase
    .from("sermons")
    .select("*")
    .order("sermon_date", { ascending: false })
    .limit(100);
  const sermons = (data ?? []) as Sermon[];

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="bg-midnight-950 text-cream-50">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <span className="flex items-center gap-2.5">
            <Church className="h-6 w-6 text-gold-400" aria-hidden />
            <span className="font-serif text-lg font-semibold">
              Agape Life Ministry
            </span>
          </span>
          <form action={signOutPastor}>
            <button
              type="submit"
              className="min-h-11 rounded-full border border-cream-50/40 px-5 py-2 font-semibold hover:border-gold-300 hover:text-gold-300"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold text-midnight-900">
          Post a Sermon
        </h1>
        <p className="mt-2 text-lg text-midnight-700">
          Fill this in, then tap the gold button. That&apos;s it.
        </p>

        <div className="mt-6 rounded-3xl border border-cream-300 bg-white p-6 shadow-sm sm:p-8">
          <PastorSermonForm />
        </div>

        <h2 className="mt-12 font-serif text-2xl font-semibold text-midnight-900">
          Your Sermons
        </h2>
        <p className="mt-1 mb-5 text-midnight-700">
          Tap a green button to hide a sermon, or a red one to show it
          again. Nothing is ever deleted.
        </p>
        <PastorSermonList sermons={sermons} />

        <p className="mt-10 text-center text-sm text-midnight-600">
          <Link
            href="/sermons"
            className="font-semibold text-royal-700 hover:text-royal-600"
          >
            See the public Sermons page →
          </Link>
        </p>
      </main>
    </div>
  );
}
