import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SermonForm from "@/components/admin/SermonForm";

export default function NewSermonPage() {
  return (
    <>
      <Link
        href="/admin/sermons"
        className="mb-6 inline-flex items-center gap-2 font-semibold text-royal-700 hover:text-royal-600"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All sermons
      </Link>
      <h1 className="mb-2 font-serif text-3xl font-semibold text-midnight-900">
        Add New Sermon
      </h1>
      <p className="mb-8 max-w-2xl text-midnight-700">
        Post your sermon to Facebook first. Then copy the Reel link, paste it
        here, and press Publish.
      </p>
      <SermonForm />
    </>
  );
}
