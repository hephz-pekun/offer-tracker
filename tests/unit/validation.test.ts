import { describe, expect, it } from "vitest";
import { applicationFormSchema, flattenZodErrors } from "@/lib/validation";

describe("applicationFormSchema", () => {
  it("accepts a minimal valid application", () => {
    const result = applicationFormSchema.safeParse({
      company: "Acme Corp",
      role: "Engineer",
      status: "APPLIED",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing company", () => {
    const result = applicationFormSchema.safeParse({
      company: "",
      role: "Engineer",
      status: "APPLIED",
    });
    expect(result.success).toBe(false);
  });

  it("treats an empty salary field as absent rather than zero", () => {
    const result = applicationFormSchema.safeParse({
      company: "Acme Corp",
      role: "Engineer",
      status: "APPLIED",
      salaryMin: "",
      salaryMax: "120000",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.salaryMin).toBeUndefined();
      expect(result.data.salaryMax).toBe(120000);
    }
  });

  it("rejects an invalid job posting URL", () => {
    const result = applicationFormSchema.safeParse({
      company: "Acme Corp",
      role: "Engineer",
      status: "APPLIED",
      jobPostingUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});

describe("flattenZodErrors", () => {
  it("returns the first message per field", () => {
    const result = applicationFormSchema.safeParse({ company: "", role: "", status: "APPLIED" });
    if (result.success) throw new Error("expected validation to fail");

    const errors = flattenZodErrors(result.error);
    expect(errors.company).toBeTruthy();
    expect(errors.role).toBeTruthy();
  });
});
