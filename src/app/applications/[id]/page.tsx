import { notFound } from "next/navigation";
import { getApplication } from "@/lib/applications";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { Timeline } from "@/components/applications/Timeline";
import { DeleteApplicationButton } from "@/components/applications/DeleteApplicationButton";
import { ButtonLink } from "@/components/ui/Button";
import { formatDate, formatSalaryRange } from "@/lib/utils";

export default async function ApplicationDetailPage({
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{application.role}</h1>
          <p className="text-lg text-slate-600">{application.company}</p>
        </div>
        <div className="flex items-center gap-2">
          <ButtonLink href={`/applications/${application.id}/edit`} variant="secondary">
            Edit
          </ButtonLink>
          <DeleteApplicationButton id={application.id} company={application.company} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="sm:col-span-2 flex flex-col gap-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-slate-500">Status</dt>
                <dd className="mt-1">
                  <StatusBadge status={application.status} />
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Location</dt>
                <dd className="mt-1 text-slate-900">{application.location ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Source</dt>
                <dd className="mt-1 text-slate-900">{application.source ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Salary range</dt>
                <dd className="mt-1 text-slate-900">
                  {formatSalaryRange(application.salaryMin, application.salaryMax)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Applied date</dt>
                <dd className="mt-1 text-slate-900">{formatDate(application.appliedDate)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Follow-up date</dt>
                <dd className="mt-1 text-slate-900">{formatDate(application.followUpDate)}</dd>
              </div>
              {application.jobPostingUrl && (
                <div className="col-span-2">
                  <dt className="text-slate-500">Job posting</dt>
                  <dd className="mt-1">
                    <a
                      href={application.jobPostingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {application.jobPostingUrl}
                    </a>
                  </dd>
                </div>
              )}
              {application.notes && (
                <div className="col-span-2">
                  <dt className="text-slate-500">Notes</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-slate-900">{application.notes}</dd>
                </div>
              )}
            </dl>
            <p className="mt-4 text-xs text-slate-400">
              Last updated {formatDate(application.createdAt)}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Activity</h2>
          <Timeline events={application.events} />
        </div>
      </div>
    </div>
  );
}
