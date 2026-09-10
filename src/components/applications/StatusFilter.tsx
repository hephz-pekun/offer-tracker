import { STATUS_LABELS, STATUS_ORDER } from "@/lib/constants";
import { Select } from "@/components/ui/Field";
import type { Status } from "@prisma/client";

export function StatusFilter({ defaultValue }: { defaultValue?: Status | "" }) {
  return (
    <Select name="status" defaultValue={defaultValue ?? ""} aria-label="Filter by status">
      <option value="">All statuses</option>
      {STATUS_ORDER.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </Select>
  );
}
