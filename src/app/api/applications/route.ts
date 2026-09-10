import { NextRequest, NextResponse } from "next/server";
import { createApplication, getApplications } from "@/lib/applications";
import { applicationFormSchema, flattenZodErrors } from "@/lib/validation";
import type { Status } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = (searchParams.get("status") as Status | null) || undefined;
  const search = searchParams.get("search") || undefined;

  const applications = await getApplications({ status, search });
  return NextResponse.json(applications);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = applicationFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ errors: flattenZodErrors(parsed.error) }, { status: 400 });
  }

  const application = await createApplication(parsed.data);
  return NextResponse.json(application, { status: 201 });
}
