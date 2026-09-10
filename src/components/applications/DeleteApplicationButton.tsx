"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function DeleteApplicationButton({ id, company }: { id: string; company: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete the application for ${company}? This can't be undone.`)) {
      return;
    }
    setIsDeleting(true);
    const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/applications");
      router.refresh();
    } else {
      setIsDeleting(false);
    }
  }

  return (
    <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? "Deleting…" : "Delete"}
    </Button>
  );
}
