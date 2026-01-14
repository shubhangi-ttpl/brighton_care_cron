/*
  Warnings:

  - You are about to drop the column `name` on the `careplan` table. All the data in the column will be lost.
  - You are about to drop the column `schedule` on the `careplan` table. All the data in the column will be lost.
  - The `roles` column on the `responsible_person` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `notify` column on the `schedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "careplan" DROP COLUMN "name",
DROP COLUMN "schedule",
ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "frequency_data" JSONB,
ADD COLUMN     "frequency_type" VARCHAR(50),
ADD COLUMN     "shift_time" JSONB,
ADD COLUMN     "status" VARCHAR(50),
ADD COLUMN     "task_name" VARCHAR(255),
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "resident_story" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "responsible_person" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "notes" VARCHAR(2000),
ADD COLUMN     "updated_by" INTEGER,
DROP COLUMN "roles",
ADD COLUMN     "roles" JSONB;

-- AlterTable
ALTER TABLE "room" ALTER COLUMN "room_number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "schedule" DROP COLUMN "notify",
ADD COLUMN     "notify" JSONB;

-- AddForeignKey
ALTER TABLE "responsible_person" ADD CONSTRAINT "responsible_person_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsible_person" ADD CONSTRAINT "responsible_person_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resident_story" ADD CONSTRAINT "resident_story_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resident_story" ADD CONSTRAINT "resident_story_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "careplan" ADD CONSTRAINT "careplan_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "careplan" ADD CONSTRAINT "careplan_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
