import Link from "next/link";
import { StatusSelect } from "@/components/applications/StatusSelect";
import { formatDate } from "@/lib/utils";
import type { ApplicationListItem } from "@/lib/applications";

export function ApplicationCard({ app }: { app: ApplicationListItem }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <Link href={`/applications/${app.id}`} className="font-medium text-slate-900 hover:underline">
        {app.company}
      </Link>
      <p className="text-sm text-slate-600">{app.role}</p>
      <p className="mt-1 text-xs text-slate-400">Applied {formatDate(app.appliedDate)}</p>
      <div className="mt-3">
        <StatusSelect id={app.id} status={app.status} />
      </div>
    </div>
  );
}
