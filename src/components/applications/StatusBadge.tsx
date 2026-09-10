import { getStatusColor, STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Status } from "@prisma/client";

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        getStatusColor(status),
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
