import { NextRequest, NextResponse } from "next/server";
import {
  changeStatus,
  deleteApplication,
  getApplication,
  updateApplication,
} from "@/lib/applications";
import { applicationFormSchema, flattenZodErrors, statusChangeSchema } from "@/lib/validation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const application = await getApplication(id);

  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(application);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();

  const isQuickStatusChange = Object.keys(body).length === 1 && "status" in body;

  if (isQuickStatusChange) {
    const parsed = statusChangeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: flattenZodErrors(parsed.error) }, { status: 400 });
    }
    const updated = await changeStatus(id, parsed.data.status);
    return NextResponse.json(updated);
  }

  const parsed = applicationFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: flattenZodErrors(parsed.error) }, { status: 400 });
  }

  const updated = await updateApplication(id, parsed.data);
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  await deleteApplication(id);
  return new NextResponse(null, { status: 204 });
}
