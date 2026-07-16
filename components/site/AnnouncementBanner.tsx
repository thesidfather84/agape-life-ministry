import { Megaphone } from "lucide-react";
import { getActiveAnnouncement } from "@/lib/queries";

export default async function AnnouncementBanner() {
  const announcement = await getActiveAnnouncement();
  if (!announcement) return null;

  return (
    <div
      role="status"
      className="bg-royal-700 px-4 py-3 text-center text-sm font-medium text-white sm:text-base"
    >
      <Megaphone className="mr-2 inline-block h-4 w-4 align-[-2px] text-gold-300" aria-hidden />
      {announcement.message}
      {announcement.link_url && (
        <>
          {" "}
          <a
            href={announcement.link_url}
            className="ml-1 underline decoration-gold-300 underline-offset-4 hover:text-gold-200"
          >
            {announcement.link_label || "Learn more"}
          </a>
        </>
      )}
    </div>
  );
}
