import { STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { ApplicationEvent } from "@prisma/client";

function describeEvent(event: ApplicationEvent): string {
  if (event.type === "STATUS_CHANGE" && event.fromStatus && event.toStatus) {
    return `Status changed from ${STATUS_LABELS[event.fromStatus]} to ${STATUS_LABELS[event.toStatus]}`;
  }
  if (event.description) return event.description;
  return event.type;
}

export function Timeline({ events }: { events: ApplicationEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-slate-500">No activity yet.</p>;
  }

  return (
    <ol className="flex flex-col gap-4">
      {events.map((event) => (
        <li key={event.id} className="flex gap-3 text-sm">
          <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-400" />
          <div>
            <p className="text-slate-700">{describeEvent(event)}</p>
            <p className="text-xs text-slate-400">{formatDate(event.createdAt)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
