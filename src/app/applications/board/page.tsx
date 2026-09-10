import { getApplications } from "@/lib/applications";
import { BoardColumn } from "@/components/applications/BoardColumn";
import { STATUS_ORDER } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  const applications = await getApplications();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">Board</h1>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUS_ORDER.map((status) => (
          <BoardColumn
            key={status}
            status={status}
            applications={applications.filter((app) => app.status === status)}
          />
        ))}
      </div>
    </div>
  );
}
