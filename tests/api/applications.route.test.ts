import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { GET } from "@/app/api/applications/route";
import { createApplication } from "@/lib/applications";
import { DEFAULT_USER_EMAIL, DEFAULT_USER_ID } from "@/lib/constants";

beforeEach(async () => {
  await prisma.applicationEvent.deleteMany();
  await prisma.application.deleteMany();
  await prisma.user.upsert({
    where: { id: DEFAULT_USER_ID },
    update: {},
    create: { id: DEFAULT_USER_ID, email: DEFAULT_USER_EMAIL },
  });
});

describe("GET /api/applications", () => {
  it("returns the applications for the current user", async () => {
    await createApplication({ company: "Acme Corp", role: "Engineer", status: "APPLIED" });

    const request = new NextRequest("http://localhost/api/applications");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0].company).toBe("Acme Corp");
  });

  it("filters by status", async () => {
    await createApplication({ company: "Acme Corp", role: "Engineer", status: "APPLIED" });
    await createApplication({ company: "Globex", role: "Engineer", status: "OFFER" });

    const request = new NextRequest("http://localhost/api/applications?status=OFFER");
    const response = await GET(request);
    const body = await response.json();

    expect(body).toHaveLength(1);
    expect(body[0].company).toBe("Globex");
  });
});
