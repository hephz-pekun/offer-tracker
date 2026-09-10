"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FieldGroup, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { STATUS_LABELS, STATUS_ORDER, SOURCE_OPTIONS } from "@/lib/constants";
import type { Application } from "@prisma/client";

function toDateInputValue(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

export function ApplicationForm({ application }: { application?: Application }) {
  const router = useRouter();
  const isEdit = Boolean(application);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const url = isEdit ? `/api/applications/${application!.id}` : "/api/applications";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setErrors(body?.errors ?? { form: "Something went wrong. Please try again." });
      setIsSubmitting(false);
      return;
    }

    const saved = await res.json();
    router.push(`/applications/${saved.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldGroup label="Company" htmlFor="company" error={errors.company}>
          <Input id="company" name="company" defaultValue={application?.company} required />
        </FieldGroup>
        <FieldGroup label="Role" htmlFor="role" error={errors.role}>
          <Input id="role" name="role" defaultValue={application?.role} required />
        </FieldGroup>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldGroup label="Status" htmlFor="status">
          <Select id="status" name="status" defaultValue={application?.status ?? "APPLIED"}>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </Select>
        </FieldGroup>
        <FieldGroup label="Source" htmlFor="source">
          <Select id="source" name="source" defaultValue={application?.source ?? ""}>
            <option value="">—</option>
            {SOURCE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </FieldGroup>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldGroup label="Location" htmlFor="location">
          <Input id="location" name="location" defaultValue={application?.location ?? ""} />
        </FieldGroup>
        <FieldGroup label="Job posting URL" htmlFor="jobPostingUrl" error={errors.jobPostingUrl}>
          <Input
            id="jobPostingUrl"
            name="jobPostingUrl"
            type="url"
            defaultValue={application?.jobPostingUrl ?? ""}
          />
        </FieldGroup>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldGroup label="Salary min" htmlFor="salaryMin">
          <Input
            id="salaryMin"
            name="salaryMin"
            type="number"
            min={0}
            defaultValue={application?.salaryMin ?? ""}
          />
        </FieldGroup>
        <FieldGroup label="Salary max" htmlFor="salaryMax">
          <Input
            id="salaryMax"
            name="salaryMax"
            type="number"
            min={0}
            defaultValue={application?.salaryMax ?? ""}
          />
        </FieldGroup>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldGroup label="Applied date" htmlFor="appliedDate">
          <Input
            id="appliedDate"
            name="appliedDate"
            type="date"
            defaultValue={toDateInputValue(application?.appliedDate)}
          />
        </FieldGroup>
        <FieldGroup label="Follow-up date" htmlFor="followUpDate">
          <Input
            id="followUpDate"
            name="followUpDate"
            type="date"
            defaultValue={toDateInputValue(application?.followUpDate)}
          />
        </FieldGroup>
      </div>

      <FieldGroup label="Notes" htmlFor="notes">
        <Textarea id="notes" name="notes" rows={4} defaultValue={application?.notes ?? ""} />
      </FieldGroup>

      {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Add application"}
        </Button>
      </div>
    </form>
  );
}
