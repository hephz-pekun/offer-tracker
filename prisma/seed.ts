import { PrismaClient, type Status } from "@prisma/client";
import { DEFAULT_USER_EMAIL, DEFAULT_USER_ID } from "../src/lib/constants";

const prisma = new PrismaClient();

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

interface SeedApplication {
  company: string;
  role: string;
  status: Status;
  location: string;
  source: string;
  appliedDaysAgo: number | null;
  followUpDaysAgo: number | null; // negative = in the future
  salaryMin?: number;
  salaryMax?: number;
  notes?: string;
}

const APPLICATIONS: SeedApplication[] = [
  { company: "Nimbus Cloud", role: "Frontend Engineer", status: "INTERVIEW", location: "Remote", source: "LinkedIn", appliedDaysAgo: 21, followUpDaysAgo: -3, salaryMin: 110000, salaryMax: 140000, notes: "Referred by a former teammate. Second-round interview scheduled." },
  { company: "Quantix Labs", role: "Backend Engineer", status: "APPLIED", location: "Austin, TX", source: "Company site", appliedDaysAgo: 5, followUpDaysAgo: -9 },
  { company: "Brightline Analytics", role: "Data Analyst", status: "OFFER", location: "Remote", source: "Referral", appliedDaysAgo: 40, followUpDaysAgo: null, salaryMin: 95000, salaryMax: 105000, notes: "Offer received, negotiating start date." },
  { company: "Foundry Robotics", role: "Software Engineer", status: "REJECTED", location: "Pittsburgh, PA", source: "Indeed", appliedDaysAgo: 55, followUpDaysAgo: null },
  { company: "Everpeak Systems", role: "Full Stack Developer", status: "PHONE_SCREEN", location: "Remote", source: "LinkedIn", appliedDaysAgo: 12, followUpDaysAgo: 2 },
  { company: "Solace Health", role: "Product Engineer", status: "WISHLIST", location: "Boston, MA", source: "Company site", appliedDaysAgo: null, followUpDaysAgo: null, notes: "Dream company — waiting for the new-grad posting to open." },
  { company: "Vantage Point Media", role: "QA Engineer", status: "APPLIED", location: "Remote", source: "Handshake", appliedDaysAgo: 3, followUpDaysAgo: -11 },
  { company: "Cobalt Studios", role: "Gameplay Engineer", status: "INTERVIEW", location: "Seattle, WA", source: "Career fair", appliedDaysAgo: 18, followUpDaysAgo: -1, salaryMin: 100000, salaryMax: 125000 },
  { company: "Larkspur Financial", role: "Backend Engineer", status: "WITHDRAWN", location: "Charlotte, NC", source: "LinkedIn", appliedDaysAgo: 33, followUpDaysAgo: null, notes: "Withdrew after accepting another offer." },
  { company: "Meridian Devices", role: "Embedded Software Engineer", status: "APPLIED", location: "Remote", source: "Indeed", appliedDaysAgo: 7, followUpDaysAgo: -7 },
  { company: "Pinehollow Software", role: "DevOps Engineer", status: "PHONE_SCREEN", location: "Denver, CO", source: "Referral", appliedDaysAgo: 15, followUpDaysAgo: 4 },
  { company: "Arclight Energy", role: "Data Engineer", status: "APPLIED", location: "Remote", source: "Company site", appliedDaysAgo: 2, followUpDaysAgo: -12 },
  { company: "Driftwood Games", role: "Mobile Engineer", status: "REJECTED", location: "Remote", source: "LinkedIn", appliedDaysAgo: 48, followUpDaysAgo: null },
  { company: "Stonebridge Consulting", role: "Software Engineer", status: "ACCEPTED", location: "Chicago, IL", source: "Referral", appliedDaysAgo: 60, followUpDaysAgo: null, salaryMin: 105000, salaryMax: 115000, notes: "Accepted! Start date is in three weeks." },
  { company: "Halcyon Biotech", role: "ML Engineer", status: "WISHLIST", location: "Remote", source: "Company site", appliedDaysAgo: null, followUpDaysAgo: null },
  { company: "Junction Mobility", role: "Frontend Engineer", status: "APPLIED", location: "Remote", source: "Indeed", appliedDaysAgo: 9, followUpDaysAgo: -5 },
  { company: "Copperleaf Retail", role: "Software Engineer Intern", status: "INTERVIEW", location: "Remote", source: "Handshake", appliedDaysAgo: 25, followUpDaysAgo: -6 },
  { company: "Northstar Logistics", role: "Backend Engineer", status: "APPLIED", location: "Remote", source: "LinkedIn", appliedDaysAgo: 4, followUpDaysAgo: -10 },
];

async function main() {
  const user = await prisma.user.upsert({
    where: { id: DEFAULT_USER_ID },
    update: {},
    create: {
      id: DEFAULT_USER_ID,
      email: DEFAULT_USER_EMAIL,
      name: "Demo User",
    },
  });

  const existingCount = await prisma.application.count({ where: { userId: user.id } });
  if (existingCount > 0) {
    console.log(`Seed skipped — ${existingCount} applications already exist.`);
    return;
  }

  for (const seedApp of APPLICATIONS) {
    const createdAt = daysAgo((seedApp.appliedDaysAgo ?? 30) + 1);

    const application = await prisma.application.create({
      data: {
        company: seedApp.company,
        role: seedApp.role,
        status: seedApp.status,
        location: seedApp.location,
        source: seedApp.source,
        appliedDate: seedApp.appliedDaysAgo !== null ? daysAgo(seedApp.appliedDaysAgo) : null,
        followUpDate: seedApp.followUpDaysAgo !== null ? daysAgo(seedApp.followUpDaysAgo) : null,
        salaryMin: seedApp.salaryMin,
        salaryMax: seedApp.salaryMax,
        notes: seedApp.notes,
        userId: user.id,
        createdAt,
        updatedAt: createdAt,
      },
    });

    await prisma.applicationEvent.create({
      data: {
        applicationId: application.id,
        type: "CREATED",
        toStatus: "APPLIED",
        description: `Application created for ${application.role} at ${application.company}`,
        createdAt,
      },
    });

    if (seedApp.status !== "APPLIED") {
      await prisma.applicationEvent.create({
        data: {
          applicationId: application.id,
          type: "STATUS_CHANGE",
          fromStatus: "APPLIED",
          toStatus: seedApp.status,
          createdAt: daysAgo(Math.max((seedApp.appliedDaysAgo ?? 30) - 5, 0)),
        },
      });
    }
  }

  console.log(`Seeded ${APPLICATIONS.length} applications for ${user.email}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
