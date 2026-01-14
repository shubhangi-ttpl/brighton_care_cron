/*
  Warnings:

  - The `meal_time` column on the `intermediate_room_resident` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `blood_pressure` on the `vitals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "address" ADD COLUMN     "apt" VARCHAR(50);

-- AlterTable
ALTER TABLE "incidents" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "status" VARCHAR(50),
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "intermediate_room_resident" ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "room_type" VARCHAR(100),
ADD COLUMN     "start_date" TIMESTAMP(3),
DROP COLUMN "meal_time",
ADD COLUMN     "meal_time" JSONB;

-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "payer_authorization" ADD COLUMN     "bin" VARCHAR(255),
ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "group_number" VARCHAR(255),
ADD COLUMN     "insurance_provider" VARCHAR(255),
ADD COLUMN     "issue_date" TIMESTAMP(3),
ADD COLUMN     "medicaid_id" VARCHAR(255),
ADD COLUMN     "member_number" VARCHAR(255),
ADD COLUMN     "pcn" VARCHAR(255),
ADD COLUMN     "state" VARCHAR(255);

-- AlterTable
ALTER TABLE "resident" ADD COLUMN     "hospital_id" INTEGER;

-- AlterTable
ALTER TABLE "responsible_person" ADD COLUMN     "clinical_speciality" VARCHAR(100),
ADD COLUMN     "contact_type" VARCHAR(50) DEFAULT 'primary',
ADD COLUMN     "fax" VARCHAR(50),
ADD COLUMN     "organization_name" VARCHAR(255),
ADD COLUMN     "primary_contact_number" VARCHAR(20),
ADD COLUMN     "primary_contact_type" VARCHAR(50),
ADD COLUMN     "profession" VARCHAR(100),
ADD COLUMN     "roles" VARCHAR(255),
ADD COLUMN     "secondary_contact_number" VARCHAR(20),
ADD COLUMN     "secondary_contact_type" VARCHAR(50),
ADD COLUMN     "title" VARCHAR(50);

-- AlterTable
ALTER TABLE "vitals" DROP COLUMN "blood_pressure",
ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "diastolic_blood_pressure" DOUBLE PRECISION,
ADD COLUMN     "systolic_blood_pressure" DOUBLE PRECISION,
ADD COLUMN     "updated_by" INTEGER;

-- CreateTable
CREATE TABLE "diet" (
    "id" SERIAL NOT NULL,
    "diet" JSONB,
    "food_allergies" JSONB,
    "resident_id" INTEGER,
    "additional_notes" VARCHAR(1000),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "diet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnoses_and_allergies" (
    "id" SERIAL NOT NULL,
    "diagnoses" JSONB,
    "allergies" JSONB,
    "resident_id" INTEGER,
    "notes" VARCHAR(1000),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "diagnoses_and_allergies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospital" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "address" VARCHAR(500),
    "contact" VARCHAR(20),
    "fax" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "immunization" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "route" VARCHAR(255),
    "administered_date" TIMESTAMP(3),
    "administered_by_id" INTEGER,
    "site" VARCHAR(100),
    "vaccine_manufacturer" VARCHAR(255),
    "lot_number" VARCHAR(100),
    "resident_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "immunization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "comment" TEXT,
    "note_id" INTEGER,
    "incident_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document" (
    "id" SERIAL NOT NULL,
    "document" VARCHAR(255),
    "incident_id" INTEGER,
    "resident_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "resident" ADD CONSTRAINT "resident_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vitals" ADD CONSTRAINT "vitals_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vitals" ADD CONSTRAINT "vitals_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diet" ADD CONSTRAINT "diet_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnoses_and_allergies" ADD CONSTRAINT "diagnoses_and_allergies_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immunization" ADD CONSTRAINT "immunization_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immunization" ADD CONSTRAINT "immunization_administered_by_id_fkey" FOREIGN KEY ("administered_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;
