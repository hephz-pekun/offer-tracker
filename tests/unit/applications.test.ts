import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";
import {
  changeStatus,
  createApplication,
  deleteApplication,
  getApplication,
  updateApplication,
} from "@/lib/applications";
import { DEFAULT_USER_EMAIL, DEFAULT_USER_ID } from "@/lib/constants";
import type { ApplicationFormInput } from "@/lib/validation";

const baseInput: ApplicationFormInput = {
  company: "Acme Corp",
  role: "Software Engineer",
  status: "APPLIED",
};

beforeEach(async () => {
  await prisma.applicationEvent.deleteMany();
  await prisma.application.deleteMany();
  await prisma.user.upsert({
    where: { id: DEFAULT_USER_ID },
    update: {},
    create: { id: DEFAULT_USER_ID, email: DEFAULT_USER_EMAIL },
  });
});

describe("createApplication", () => {
  it("creates an application and a CREATED timeline event", async () => {
    const application = await createApplication(baseInput);

    expect(application.company).toBe("Acme Corp");
    expect(application.status).toBe("APPLIED");

    const withEvents = await getApplication(application.id);
    expect(withEvents?.events).toHaveLength(1);
    expect(withEvents?.events[0].type).toBe("CREATED");
  });
});

describe("changeStatus", () => {
  it("updates the status and records a STATUS_CHANGE event", async () => {
    const application = await createApplication(baseInput);

    const updated = await changeStatus(application.id, "INTERVIEW");
    expect(updated.status).toBe("INTERVIEW");

    const withEvents = await getApplication(application.id);
    const statusEvents = withEvents?.events.filter((e) => e.type === "STATUS_CHANGE");
    expect(statusEvents).toHaveLength(1);
    expect(statusEvents?.[0]).toMatchObject({ fromStatus: "APPLIED", toStatus: "INTERVIEW" });
  });

  it("does not record an event when the status is unchanged", async () => {
    const application = await createApplication(baseInput);

    await changeStatus(application.id, "APPLIED");

    const withEvents = await getApplication(application.id);
    const statusEvents = withEvents?.events.filter((e) => e.type === "STATUS_CHANGE");
    expect(statusEvents).toHaveLength(0);
  });
});

describe("updateApplication", () => {
  it("updates fields without duplicating events when status is unchanged", async () => {
    const application = await createApplication(baseInput);

    const updated = await updateApplication(application.id, {
      ...baseInput,
      location: "Remote",
    });

    expect(updated.location).toBe("Remote");
    const withEvents = await getApplication(application.id);
    expect(withEvents?.events).toHaveLength(1);
  });
});

describe("deleteApplication", () => {
  it("removes the application and cascades its events", async () => {
    const application = await createApplication(baseInput);

    await deleteApplication(application.id);

    const found = await getApplication(application.id);
    expect(found).toBeNull();

    const orphanedEvents = await prisma.applicationEvent.findMany({
      where: { applicationId: application.id },
    });
    expect(orphanedEvents).toHaveLength(0);
  });
});
