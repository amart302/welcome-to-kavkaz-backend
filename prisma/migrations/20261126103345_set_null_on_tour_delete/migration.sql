-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_tourId_fkey";

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE SET NULL ON UPDATE CASCADE;
