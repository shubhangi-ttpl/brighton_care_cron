-- AlterTable
ALTER TABLE "intermediate_room_resident" ADD COLUMN     "occupancy_type" VARCHAR(100);

-- AlterTable
ALTER TABLE "resident" ADD COLUMN     "admission_type" VARCHAR(255),
ADD COLUMN     "community" VARCHAR(255),
ADD COLUMN     "effective_start_date" TIMESTAMP(3),
ADD COLUMN     "is_as_soon_as_possible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_hospice" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_respite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "move_in_date" TIMESTAMP(3),
ADD COLUMN     "summary_notes" VARCHAR(2000);

-- AlterTable
ALTER TABLE "responsible_person" ADD COLUMN     "status" VARCHAR(50);
