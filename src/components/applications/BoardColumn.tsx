import { STATUS_LABELS } from "@/lib/constants";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import type { Status } from "@prisma/client";
import type { ApplicationListItem } from "@/lib/applications";

export function BoardColumn({
  status,
  applications,
}: {
  status: Status;
  applications: ApplicationListItem[];
}) {
  return (
    <div className="flex w-72 shrink-0 flex-col gap-3 rounded-lg bg-slate-50 p-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-slate-700">{STATUS_LABELS[status]}</h3>
        <span className="text-xs text-slate-400">{applications.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {applications.map((app) => (
          <ApplicationCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}
