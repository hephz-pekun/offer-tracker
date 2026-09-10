import { notFound } from "next/navigation";
import { getApplication } from "@/lib/applications";
import { ApplicationForm } from "@/components/applications/ApplicationForm";

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = await getApplication(id);

  if (!application) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Edit {application.company} — {application.role}
      </h1>
      <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
        <ApplicationForm application={application} />
      </div>
    </div>
  );
}
