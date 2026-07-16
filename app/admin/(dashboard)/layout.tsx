import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Church } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signOut } from "@/app/actions/auth";

export const metadata = {
  title: "Church Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!isSupabaseConfigured()) redirect("/admin/login");

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="border-b border-midnight-100 bg-midnight-950 text-cream-50">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <Church className="h-6 w-6 text-gold-400" aria-hidden />
            <span className="font-serif text-lg font-semibold">
              Agape Life Ministry — Admin
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-sm font-semibold text-midnight-100 hover:text-gold-300"
            >
              View Website
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-cream-50/40 px-4 py-2 text-sm font-semibold hover:border-gold-300 hover:text-gold-300"
              >
                Log Out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
