import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EventForm from "@/components/admin/EventForm";

export default function NewEventPage() {
  return (
    <>
      <Link
        href="/admin/events"
        className="mb-6 inline-flex items-center gap-2 font-semibold text-royal-700 hover:text-royal-600"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All events
      </Link>
      <h1 className="mb-2 font-serif text-3xl font-semibold text-midnight-900">
        Add an Event
      </h1>
      <p className="mb-8 text-midnight-700">
        Fill in the details and tap Publish Event when you&apos;re ready for
        it to appear on the website.
      </p>
      <EventForm />
    </>
  );
}
