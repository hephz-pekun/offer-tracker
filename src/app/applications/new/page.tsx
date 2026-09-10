import { ApplicationForm } from "@/components/applications/ApplicationForm";

export default function NewApplicationPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">Add application</h1>
      <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
        <ApplicationForm />
      </div>
    </div>
  );
}
