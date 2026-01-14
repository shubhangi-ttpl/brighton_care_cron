-- AlterTable
ALTER TABLE "incident_alert" ADD COLUMN     "note_id" INTEGER;

-- AlterTable
ALTER TABLE "resident" ADD COLUMN     "care_level" VARCHAR(255),
ADD COLUMN     "financial_effective_end_date" TIMESTAMP(3),
ADD COLUMN     "move_out_date" TIMESTAMP(3),
ADD COLUMN     "move_out_notes" VARCHAR(2000),
ADD COLUMN     "move_out_reason" VARCHAR(255);

-- CreateTable
CREATE TABLE "marked_as_away" (
    "id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(3),
    "start_time" VARCHAR(50),
    "reason" VARCHAR(255),
    "return_date" TIMESTAMP(3),
    "return_time" VARCHAR(50),
    "resident_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "marked_as_away_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "incident_alert" ADD CONSTRAINT "incident_alert_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marked_as_away" ADD CONSTRAINT "marked_as_away_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;
