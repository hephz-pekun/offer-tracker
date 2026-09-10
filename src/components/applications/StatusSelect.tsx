"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/constants";
import { Select } from "@/components/ui/Field";
import type { Status } from "@prisma/client";

export function StatusSelect({ id, status }: { id: string; status: Status }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(status);

  async function handleChange(next: Status) {
    setValue(next);
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!res.ok) {
      setValue(status);
      return;
    }
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <Select
      value={value}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value as Status)}
      className="w-auto py-1 text-xs"
      aria-label="Change status"
    >
      {STATUS_ORDER.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </Select>
  );
}
