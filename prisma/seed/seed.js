const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Start full seeding...");

  //Load RawPeopleInfluencer
  const rawRows = await prisma.rawPeopleInfluencer.findMany();
  console.log(`Loaded ${rawRows.length} raw records`);

  //Insert People + InfluencerProfile
  const indCandidates = [];

  for (const raw of rawRows) {
    const type = raw.recordType === "influencer" ? "INF" : "IND";

    // Skip if already exists
    const existing = await prisma.people.findUnique({
      where: { recordId: raw.recordId },
    });
    if (existing) continue;

    const person = await prisma.people.create({
      data: {
        recordId: raw.recordId,
        type,
        fullName: raw.fullName,
        preferredName: raw.preferredName,
        gender: raw.gender,
        birthDate: raw.birthDate,
        email: raw.email,
        phone: raw.phone,
        city: raw.city,
        country: raw.country,
        occupation: raw.occupation,
        interests: raw.interests,
        notes: raw.notes,
        collaborationStatus: raw.collaborationStatus,
        languages: raw.languages,
        lastContactDate: raw.lastContactDate,
        portfolioUrl: raw.portfolioUrl,
      },
    });

    console.log(`People created: ${person.fullName}`);

    if (type === "INF") {
      await prisma.influencerProfile.create({
        data: {
          peopleId: person.id,
          category: raw.influencerCategory,
          primaryPlatform: raw.primaryPlatform,
          primaryFollowers: raw.followersCount,
          totalFollowersCount: raw.totalFollowersCount,
          engagementRate: raw.engagementRate,
          engagementRateTier: raw.engagementRateTier,
          secondaryPlatform: raw.secondaryPlatform,
          secondaryFollowersCount: raw.secondaryFollowersCount,
          averageMonthlyReach: raw.averageMonthlyReach,
        },
      });
      console.log(`InfluencerProfile created for ${person.fullName}`);
    } else {
      indCandidates.push(person);
    }
  }

  // Seed Admin
  const adminEmail = "admin@example.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("admin123", 10); // default admin password
    await prisma.user.create({
      data: {
        username: "admin",
        email: adminEmail,
        fullName: "Adminstrator",
        passwordHash,
        role: "admin",
        status: "active",
      },
    });
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists, skipping");
  }

  // Seed Users (10 IND) & hash password
  const selectedUsers = indCandidates.slice(0, 10);

  for (const p of selectedUsers) {
    if (!p.email) continue;

    const existingUser = await prisma.user.findUnique({
      where: { email: p.email },
    });
    if (existingUser) continue;

    const passwordHash = await bcrypt.hash("password123", 10); // default password

    await prisma.user.create({
      data: {
        username: p.email.split("@")[0],
        email: p.email,
        fullName: p.fullName,
        passwordHash,
        role: "editor",
        status: "active",
      },
    });
    console.log(`User created for People: ${p.fullName}`);
  }

  console.log("Full seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
