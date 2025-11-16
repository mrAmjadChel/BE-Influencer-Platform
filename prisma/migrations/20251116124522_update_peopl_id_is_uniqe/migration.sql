/*
  Warnings:

  - A unique constraint covering the columns `[peopleId]` on the table `InfluencerProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InfluencerProfile_peopleId_key" ON "InfluencerProfile"("peopleId");
