-- AlterTable
ALTER TABLE "images" ADD COLUMN     "tourId" UUID;

-- CreateTable
CREATE TABLE "tours" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "durationHours" INTEGER,
    "location" VARCHAR(255) NOT NULL,
    "meetingPoint" TEXT NOT NULL,
    "maxParticipants" INTEGER,
    "included" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notIncluded" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "whatToBring" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "importantInfo" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_days" (
    "id" UUID NOT NULL,
    "tourId" UUID NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "overnight" VARCHAR(255),

    CONSTRAINT "tour_days_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tours_slug_key" ON "tours"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tour_days_tourId_dayNumber_key" ON "tour_days"("tourId", "dayNumber");

-- CreateIndex
CREATE INDEX "images_tourId_position_idx" ON "images"("tourId", "position");

-- AddForeignKey
ALTER TABLE "tour_days" ADD CONSTRAINT "tour_days_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;
