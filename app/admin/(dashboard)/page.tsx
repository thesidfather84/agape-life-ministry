import Link from "next/link";
import {
  BookOpen,
  CalendarPlus,
  HeartHandshake,
  Mail,
  Megaphone,
  Settings,
} from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";

const BUTTONS = [
  {
    href: "/admin/daily-word/new",
    icon: BookOpen,
    title: "Post Today's Scripture",
    text: "Share a scripture and a short message with everyone.",
  },
  {
    href: "/admin/events/new",
    icon: CalendarPlus,
    title: "Add an Event",
    text: "Put a service or gathering on the church calendar.",
  },
  {
    href: "/admin/settings",
    icon: Settings,
    title: "Edit Church Information",
    text: "Update the phone number, email, address, or service time.",
  },
  {
    href: "/admin/prayer-requests",
    icon: HeartHandshake,
    title: "View Prayer Requests",
    text: "Read the prayer needs people have sent in.",
  },
  {
    href: "/admin/messages",
    icon: Mail,
    title: "View Contact Messages",
    text: "See messages, visitor cards, and text signups.",
  },
  {
    href: "/admin/announcement",
    icon: Megaphone,
    title: "Manage Homepage Announcement",
    text: "Show or hide a special notice at the top of the website.",
  },
] as const;

export default async function AdminDashboard() {
  const supabase = await createServerSupabase();

  // Show gentle counts so the pastor knows if anything is waiting.
  const [prayer, messages] = await Promise.all([
    supabase
      .from("prayer_requests")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
  ]);

  const badges: Record<string, number> = {
    "/admin/prayer-requests": prayer.count ?? 0,
    "/admin/messages": messages.count ?? 0,
  };

  return (
    <>
      <h1 className="font-serif text-3xl font-semibold text-midnight-900">
        Welcome, Pastor
      </h1>
      <p className="mt-2 text-midnight-700">
        What would you like to do today?
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {BUTTONS.map(({ href, icon: Icon, title, text }) => (
          <Link
            key={href}
            href={href}
            className="group relative flex items-start gap-4 rounded-3xl border border-cream-300 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-royal-100 transition-colors group-hover:bg-gold-100">
              <Icon className="h-7 w-7 text-royal-700 transition-colors group-hover:text-gold-700" aria-hidden />
            </div>
            <div>
              <p className="text-lg font-semibold text-midnight-900">
                {title}
                {badges[href] > 0 && (
                  <span className="ml-2 inline-flex min-w-7 items-center justify-center rounded-full bg-gold-400 px-2 py-0.5 text-sm font-bold text-midnight-950">
                    {badges[href]}
                  </span>
                )}
              </p>
              <p className="mt-1 text-sm text-midnight-700">{text}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
