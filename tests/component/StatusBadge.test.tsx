// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/applications/StatusBadge";

describe("StatusBadge", () => {
  it("renders the human-readable label for a status", () => {
    render(<StatusBadge status="PHONE_SCREEN" />);
    expect(screen.getByText("Phone Screen")).toBeInTheDocument();
  });

  it("renders a label for every status value without throwing", () => {
    const statuses = [
      "WISHLIST",
      "APPLIED",
      "PHONE_SCREEN",
      "INTERVIEW",
      "OFFER",
      "ACCEPTED",
      "REJECTED",
      "WITHDRAWN",
    ] as const;

    for (const status of statuses) {
      const { unmount } = render(<StatusBadge status={status} />);
      unmount();
    }
  });
});
