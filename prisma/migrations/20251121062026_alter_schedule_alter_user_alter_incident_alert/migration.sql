/*
  Warnings:

  - You are about to drop the column `notify` on the `schedule` table. All the data in the column will be lost.
  - The `assigned_staff` column on the `schedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "incident_alert" ADD COLUMN     "is_sent" BOOLEAN DEFAULT false,
ADD COLUMN     "last_sent_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "schedule" DROP COLUMN "notify",
ADD COLUMN     "end_time" VARCHAR(50),
ADD COLUMN     "notify_other" BOOLEAN DEFAULT false,
ADD COLUMN     "notify_placement_agent" BOOLEAN DEFAULT false,
ADD COLUMN     "notify_primary_care_provider" BOOLEAN DEFAULT false,
ADD COLUMN     "notify_responsible_person" BOOLEAN DEFAULT false,
ADD COLUMN     "other" VARCHAR(255),
DROP COLUMN "assigned_staff",
ADD COLUMN     "assigned_staff" INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "token_version" INTEGER DEFAULT 0;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_assigned_staff_fkey" FOREIGN KEY ("assigned_staff") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
