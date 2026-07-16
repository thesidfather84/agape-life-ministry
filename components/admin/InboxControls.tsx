import { toggleInboxRead, deleteInboxItem } from "@/app/actions/admin";
import DeleteButton from "./DeleteButton";

/** Mark read/unread + delete controls for private inbox items. */
export default function InboxControls({
  table,
  id,
  isRead,
}: {
  table: "prayer_requests" | "contact_messages" | "welcome_cards";
  id: string;
  isRead: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <form action={toggleInboxRead}>
        <input type="hidden" name="table" value={table} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="is_read" value={String(isRead)} />
        <button
          type="submit"
          className="inline-flex min-h-10 items-center rounded-full bg-midnight-50 px-4 py-2 text-sm font-semibold text-midnight-800 hover:bg-midnight-100"
        >
          {isRead ? "Mark as unread" : "Mark as read"}
        </button>
      </form>
      <DeleteButton action={deleteInboxItem} id={id} table={table} />
    </div>
  );
}
