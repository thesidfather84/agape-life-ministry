import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DailyWordForm from "@/components/admin/DailyWordForm";

export default function NewDailyWordPage() {
  return (
    <>
      <Link
        href="/admin/daily-word"
        className="mb-6 inline-flex items-center gap-2 font-semibold text-royal-700 hover:text-royal-600"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All Daily Word posts
      </Link>
      <h1 className="mb-2 font-serif text-3xl font-semibold text-midnight-900">
        Post Today&apos;s Scripture
      </h1>
      <p className="mb-8 text-midnight-700">
        Fill in the scripture and your message. The preview on the right shows
        exactly how it will look on the website.
      </p>
      <DailyWordForm />
    </>
  );
}
