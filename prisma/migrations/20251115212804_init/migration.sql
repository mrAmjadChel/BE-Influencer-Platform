-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'editor', 'viewer');

-- CreateEnum
CREATE TYPE "PersonType" AS ENUM ('IND', 'INF');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('Instagram', 'TikTok', 'YouTube', 'Facebook', 'Twitch', 'Other');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'editor',
    "fullName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawPeopleInfluencer" (
    "recordId" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "preferredName" TEXT,
    "gender" TEXT,
    "birthDate" TIMESTAMP(3),
    "email" TEXT,
    "phone" TEXT,
    "city" TEXT,
    "country" TEXT,
    "occupation" TEXT,
    "influencerCategory" TEXT,
    "primaryPlatform" TEXT,
    "followersCount" INTEGER,
    "totalFollowersCount" INTEGER,
    "engagementRate" DECIMAL(8,2),
    "engagementRateTier" TEXT,
    "interests" TEXT,
    "notes" TEXT,
    "secondaryPlatform" TEXT,
    "secondaryFollowersCount" INTEGER,
    "averageMonthlyReach" INTEGER,
    "collaborationStatus" TEXT,
    "languages" TEXT,
    "portfolioUrl" TEXT,
    "lastContactDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawPeopleInfluencer_pkey" PRIMARY KEY ("recordId")
);

-- CreateTable
CREATE TABLE "People" (
    "id" SERIAL NOT NULL,
    "recordId" TEXT,
    "type" "PersonType" NOT NULL,
    "fullName" TEXT NOT NULL,
    "preferredName" TEXT,
    "gender" TEXT,
    "birthDate" TIMESTAMP(3),
    "email" TEXT,
    "phone" TEXT,
    "city" TEXT,
    "country" TEXT,
    "occupation" TEXT,
    "interests" TEXT,
    "notes" TEXT,
    "collaborationStatus" TEXT,
    "languages" TEXT,
    "lastContactDate" TIMESTAMP(3),
    "portfolioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "People_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InfluencerProfile" (
    "id" SERIAL NOT NULL,
    "peopleId" INTEGER NOT NULL,
    "category" TEXT,
    "primaryPlatform" "Platform",
    "primaryFollowers" INTEGER,
    "totalFollowersCount" INTEGER,
    "engagementRate" DECIMAL(8,2),
    "engagementRateTier" TEXT,
    "secondaryPlatform" "Platform",
    "secondaryFollowersCount" INTEGER,
    "averageMonthlyReach" INTEGER,

    CONSTRAINT "InfluencerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "People_recordId_key" ON "People"("recordId");

-- AddForeignKey
ALTER TABLE "InfluencerProfile" ADD CONSTRAINT "InfluencerProfile_peopleId_fkey" FOREIGN KEY ("peopleId") REFERENCES "People"("id") ON DELETE CASCADE ON UPDATE CASCADE;
