-- AlterTable
ALTER TABLE "incidents" ADD COLUMN     "first_aid" BOOLEAN,
ADD COLUMN     "first_aid_description" VARCHAR(1000),
ADD COLUMN     "nurse_progress" VARCHAR(1000),
ADD COLUMN     "shift_supervisor" INTEGER,
ADD COLUMN     "signature" VARCHAR(255),
ADD COLUMN     "transported" BOOLEAN,
ADD COLUMN     "witness_to_incident" VARCHAR(1000);

-- AlterTable
ALTER TABLE "intermediate_room_resident" ADD COLUMN     "is_primary" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "incident_alert" (
    "id" SERIAL NOT NULL,
    "incident_id" INTEGER,
    "alert_duration" VARCHAR(50),
    "alert_instructions" VARCHAR(1000),
    "after_hour_action" VARCHAR(1000),
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "status" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "incident_alert_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_shift_supervisor_fkey" FOREIGN KEY ("shift_supervisor") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_alert" ADD CONSTRAINT "incident_alert_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_alert" ADD CONSTRAINT "incident_alert_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_alert" ADD CONSTRAINT "incident_alert_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
