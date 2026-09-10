import { z } from "zod";

export const StatusEnum = z.enum([
  "WISHLIST",
  "APPLIED",
  "PHONE_SCREEN",
  "INTERVIEW",
  "OFFER",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
]);

export const applicationFormSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  status: StatusEnum,
  jobPostingUrl: z.union([z.literal(""), z.string().url()]).optional(),
  location: z.string().optional(),
  salaryMin: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? undefined : v),
    z.coerce.number().int().nonnegative().optional(),
  ),
  salaryMax: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? undefined : v),
    z.coerce.number().int().nonnegative().optional(),
  ),
  source: z.string().optional(),
  appliedDate: z.string().optional(),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
});

export type ApplicationFormInput = z.infer<typeof applicationFormSchema>;

export const statusChangeSchema = z.object({
  status: StatusEnum,
});

export function flattenZodErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path.join(".") || "form";
    if (!(field in result)) {
      result[field] = issue.message;
    }
  }
  return result;
}
