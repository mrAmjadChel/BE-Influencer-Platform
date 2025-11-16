const prisma = require("../utils/prisma");

const pickPeopleFields = (data) => ({
  recordId: data.recordId,
  type: data.type,
  fullName: data.fullName,
  preferredName: data.preferredName,
  gender: data.gender,
  birthDate: data.birthDate,
  email: data.email,
  phone: data.phone,
  city: data.city,
  country: data.country,
  occupation: data.occupation,
  interests: data.interests,
  notes: data.notes,
  collaborationStatus: data.collaborationStatus,
  languages: data.languages,
  lastContactDate: data.lastContactDate,
  portfolioUrl: data.portfolioUrl,
});

// GET /api/people?type=&city=&status
exports.getAll = async (req, res, next) => {
  try {
    const { type, city, status, category, tier } = req.query;

    const people = await prisma.people.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(city ? { city } : {}),
        ...(status ? { collaborationStatus: status } : {}),
      },
      include: {
        influencerProfiles: {
          where: {
            ...(category ? { category } : {}),
            ...(tier ? { engagementRateTier: tier } : {}),
          },
        },
      },
    });

    const result = people.map((p) => ({
      ...p,
      influencerProfile: p.influencerProfiles[0] || null,
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// GET /api/people/:id
exports.getById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const person = await prisma.people.findUnique({
      where: { id },
      include: { influencerProfiles: true },
    });

    if (!person) return res.status(404).json({ error: "ไม่พบบุคคลนี้" });

    res.json(person);
  } catch (err) {
    next(err);
  }
};

const parseDate = (value) => (value ? new Date(value) : null);

// Generate recordId automatically
const generateRecordId = async (type) => {
  const lastRecord = await prisma.people.findFirst({
    where: { type },
    orderBy: { id: "desc" },
    select: { recordId: true },
  });

  if (lastRecord && lastRecord.recordId) {
    const lastNum = parseInt(lastRecord.recordId.split("-")[1], 10);
    return `${type}-${String(lastNum + 1).padStart(3, "0")}`;
  } else {
    return `${type}-001`;
  }
};

// POST /api/people
exports.create = async (req, res, next) => {
  try {
    const type = req.body.type;
    if (!["INF", "IND"].includes(type)) {
      return res.status(400).json({ error: "type ต้องเป็น 'INF' หรือ 'IND'" });
    }

    // Generate recordId
    const recordId = await generateRecordId(type);

    // Prepare People data
    const personData = {
      ...pickPeopleFields(req.body),
      recordId,
      type,
      birthDate: parseDate(req.body.birthDate),
      lastContactDate: parseDate(req.body.lastContactDate),
    };

    const newPerson = await prisma.people.create({ data: personData });

    // Create InfluencerProfile if INF
    let influencerProfile = null;
    if (type === "INF") {
      const profileData = {
        peopleId: newPerson.id,
        category: req.body.category,
        primaryPlatform: req.body.primaryPlatform,
        primaryFollowers: req.body.primaryFollowers,
        totalFollowersCount: req.body.totalFollowersCount,
        engagementRate: req.body.engagementRate || null,
        engagementRateTier: req.body.engagementRateTier || null,
        secondaryPlatform: req.body.secondaryPlatform || null,
        secondaryFollowersCount: req.body.secondaryFollowersCount || null,
        averageMonthlyReach: req.body.averageMonthlyReach,
      };

      influencerProfile = await prisma.influencerProfile.create({
        data: profileData,
      });
    }

    res.status(201).json({ person: newPerson, influencerProfile });
  } catch (err) {
    next(err);
  }
};

// PUT /api/people/:id
exports.update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const type = req.body.type;

    if (!["INF", "IND"].includes(type)) {
      return res.status(400).json({ error: "type ต้องเป็น 'INF' หรือ 'IND'" });
    }

    // Update People
    const updatedPerson = await prisma.people.update({
      where: { id },
      data: {
        ...pickPeopleFields(req.body),
        type,
        birthDate: parseDate(req.body.birthDate),
        lastContactDate: parseDate(req.body.lastContactDate),
      },
    });

    let influencerProfile = null;

    if (type === "INF") {
      const profileData = {
        category: req.body.category,
        primaryPlatform: req.body.primaryPlatform,
        primaryFollowers: req.body.primaryFollowers,
        totalFollowersCount: req.body.totalFollowersCount ?? null,
        engagementRate: req.body.engagementRate ?? null,
        engagementRateTier: req.body.engagementRateTier || null,
        secondaryPlatform: req.body.secondaryPlatform || null,
        secondaryFollowersCount: req.body.secondaryFollowersCount ?? null,
        averageMonthlyReach: req.body.averageMonthlyReach ?? null,
      };

      const existingProfile = await prisma.influencerProfile.findUnique({
        where: { peopleId: id },
      });
      if (existingProfile) {
        influencerProfile = await prisma.influencerProfile.update({
          where: { peopleId: id },
          data: profileData,
        });
      } else {
        influencerProfile = await prisma.influencerProfile.create({
          data: { peopleId: id, ...profileData },
        });
      }
    } else {
      // Delete profile if type changed to IND
      const existingProfile = await prisma.influencerProfile.findUnique({
        where: { peopleId: id },
      });
      if (existingProfile) {
        await prisma.influencerProfile.delete({ where: { peopleId: id } });
      }
    }

    res.json({ person: updatedPerson, influencerProfile });
  } catch (err) {
    if (err.code === "P2025")
      return res.status(404).json({ error: "ไม่พบบุคคลนี้" });
    next(err);
  }
};

// DELETE /api/people/:id
exports.remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    await prisma.people.delete({
      where: { id },
    });

    res.json({ message: "ลบบุคคลสำเร็จ" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "ไม่พบบุคคลนี้" });
    }
    next(err);
  }
};
