import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import InboxControls from "@/components/admin/InboxControls";
import type { ContactMessage, SmsOptin, WelcomeCard } from "@/lib/types";

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

export default async function AdminMessagesPage() {
  const supabase = await createServerSupabase();
  const [messagesRes, cardsRes, optinsRes] = await Promise.all([
    supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("welcome_cards")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("sms_optins")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500),
  ]);

  const messages = (messagesRes.data ?? []) as ContactMessage[];
  const cards = (cardsRes.data ?? []) as WelcomeCard[];
  const optins = (optinsRes.data ?? []) as SmsOptin[];

  return (
    <>
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-2 font-semibold text-royal-700 hover:text-royal-600"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to dashboard
      </Link>
      <h1 className="mb-8 font-serif text-3xl font-semibold text-midnight-900">
        Messages &amp; Signups
      </h1>

      <section className="mb-12">
        <h2 className="mb-4 font-serif text-2xl font-semibold text-midnight-900">
          Contact Messages
        </h2>
        {messages.length === 0 ? (
          <p className="rounded-3xl border border-cream-300 bg-white p-6 text-midnight-700">
            No messages yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {messages.map((message) => (
              <li
                key={message.id}
                className={`rounded-3xl border p-6 ${
                  message.is_read
                    ? "border-cream-300 bg-cream-100"
                    : "border-gold-300 bg-white shadow-sm"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-midnight-900">
                    {message.name}
                    {!message.is_read && (
                      <span className="ml-2 rounded-full bg-gold-400 px-2.5 py-0.5 text-xs font-bold text-midnight-950">
                        New
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-midnight-600">
                    {formatWhen(message.created_at)}
                  </p>
                </div>
                <p className="mt-1 text-sm text-midnight-700">
                  Reply to: {message.contact}
                </p>
                <p className="mt-4 whitespace-pre-line text-midnight-800">
                  {message.message}
                </p>
                <div className="mt-5">
                  <InboxControls
                    table="contact_messages"
                    id={message.id}
                    isRead={message.is_read}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-12">
        <h2 className="mb-4 font-serif text-2xl font-semibold text-midnight-900">
          First-Time Visitor Cards
        </h2>
        {cards.length === 0 ? (
          <p className="rounded-3xl border border-cream-300 bg-white p-6 text-midnight-700">
            No visitor cards yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {cards.map((card) => (
              <li
                key={card.id}
                className={`rounded-3xl border p-6 ${
                  card.is_read
                    ? "border-cream-300 bg-cream-100"
                    : "border-gold-300 bg-white shadow-sm"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-midnight-900">
                    {card.first_name}
                    {card.wants_contact && (
                      <span className="ml-2 rounded-full bg-royal-100 px-2.5 py-0.5 text-xs font-semibold text-royal-800">
                        Wants a call
                      </span>
                    )}
                    {!card.is_read && (
                      <span className="ml-2 rounded-full bg-gold-400 px-2.5 py-0.5 text-xs font-bold text-midnight-950">
                        New
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-midnight-600">
                    {formatWhen(card.created_at)}
                  </p>
                </div>
                {card.contact && (
                  <p className="mt-1 text-sm text-midnight-700">
                    Reach them at: {card.contact}
                  </p>
                )}
                {card.questions && (
                  <p className="mt-4 whitespace-pre-line text-midnight-800">
                    {card.questions}
                  </p>
                )}
                <div className="mt-5">
                  <InboxControls
                    table="welcome_cards"
                    id={card.id}
                    isRead={card.is_read}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 font-serif text-2xl font-semibold text-midnight-900">
          Text Message Signups
        </h2>
        <p className="mb-4 max-w-2xl text-sm text-midnight-700">
          These members asked to receive scripture by text. Automated texting
          is not connected yet — when you are ready, a service like Twilio can
          send to this list.
        </p>
        {optins.length === 0 ? (
          <p className="rounded-3xl border border-cream-300 bg-white p-6 text-midnight-700">
            No signups yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-cream-300 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-cream-300 text-midnight-700">
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Name
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Mobile number
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Signed up
                  </th>
                </tr>
              </thead>
              <tbody>
                {optins.map((optin) => (
                  <tr key={optin.id} className="border-b border-cream-200 last:border-0">
                    <td className="px-5 py-3 font-medium text-midnight-900">
                      {optin.first_name}
                    </td>
                    <td className="px-5 py-3 text-midnight-800">{optin.phone}</td>
                    <td className="px-5 py-3 text-midnight-700">
                      {formatWhen(optin.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
