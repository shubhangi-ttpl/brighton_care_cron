-- CreateTable
CREATE TABLE "address" (
    "id" SERIAL NOT NULL,
    "address_line_1" VARCHAR(255),
    "address_line_2" VARCHAR(255),
    "city" VARCHAR(255),
    "state" VARCHAR(255),
    "country" VARCHAR(255),
    "zip_code" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facility" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "address_id" INTEGER,
    "contact" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "status" VARCHAR(50),
    "is_deleted" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "email" VARCHAR(255),
    "role_id" INTEGER,
    "status" VARCHAR(50),
    "is_deleted" BOOLEAN,
    "username" VARCHAR(255),
    "password" VARCHAR(255),
    "address_id" INTEGER,
    "is_remember_me" BOOLEAN,
    "facility_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room" (
    "id" SERIAL NOT NULL,
    "room_number" INTEGER,
    "room_type" VARCHAR(255),
    "status" VARCHAR(50),
    "facility_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resident" (
    "id" SERIAL NOT NULL,
    "profile_image" VARCHAR(255),
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "ssn" VARCHAR(50),
    "date_of_birth" TIMESTAMP(3),
    "gender" VARCHAR(50),
    "pronouns" VARCHAR(50),
    "marital_status" VARCHAR(50),
    "contact_number" VARCHAR(50),
    "is_marked_as_away" BOOLEAN,
    "signature" VARCHAR(255),
    "mrn" VARCHAR(255),
    "move_status" VARCHAR(50),
    "status" VARCHAR(50),
    "source" VARCHAR(255),
    "profileComplete" VARCHAR(10),
    "address_id" INTEGER,
    "room_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "resident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsible_person" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "relationship_category" VARCHAR(255),
    "specific_relationship" VARCHAR(255),
    "contact_number_type" VARCHAR(50),
    "contact_number" VARCHAR(20),
    "email" VARCHAR(255),
    "is_primary" BOOLEAN DEFAULT false,
    "is_email" BOOLEAN DEFAULT false,
    "is_text" BOOLEAN DEFAULT false,
    "is_phone" BOOLEAN DEFAULT false,
    "is_physical_mail" BOOLEAN DEFAULT false,
    "address_id" INTEGER,
    "resident_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "responsible_person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinical_quick_risk" (
    "id" SERIAL NOT NULL,
    "medical_conditions" JSONB,
    "allergies" JSONB,
    "assistive_devices" JSONB,
    "resident_id" INTEGER,
    "status" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "clinical_quick_risk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payer_authorization" (
    "id" SERIAL NOT NULL,
    "insurance_name" VARCHAR(255),
    "insurance_type" VARCHAR(255),
    "holder_name" VARCHAR(255),
    "insurance_date" TIMESTAMP(3),
    "relationship_to_insured" VARCHAR(255),
    "status" VARCHAR(50),
    "policy_number" VARCHAR(255),
    "resident_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "payer_authorization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medication" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "dose" VARCHAR(255),
    "route" VARCHAR(255),
    "prescriber" VARCHAR(255),
    "schedule" VARCHAR(255),
    "recent_changes" VARCHAR(255),
    "status" VARCHAR(50),
    "resident_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prn_baseline" (
    "id" SERIAL NOT NULL,
    "pain_baseline" JSONB,
    "agitation_baseline" JSONB,
    "status" VARCHAR(50),
    "resident_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "prn_baseline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_services" (
    "id" SERIAL NOT NULL,
    "required_services" JSONB,
    "is_regular_visit" BOOLEAN,
    "status" VARCHAR(50),
    "resident_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "order_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intermediate_room_resident" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER,
    "resident_id" INTEGER,
    "meal_time" VARCHAR(100),
    "status" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "intermediate_room_resident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_signature" (
    "id" SERIAL NOT NULL,
    "resident_id" INTEGER,
    "signed_by" VARCHAR(255),
    "signature" TEXT,
    "signature_type" VARCHAR(100),
    "status" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "assessment_signature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "downtime_mar" (
    "id" SERIAL NOT NULL,
    "responsible_staff" VARCHAR(255),
    "userId" INTEGER,
    "facilityId" INTEGER,
    "location" VARCHAR(255),
    "tracking_process" VARCHAR(255),
    "status" VARCHAR(50),
    "resident_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "downtime_mar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_factor" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "severity" VARCHAR(100),
    "resident_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "risk_factor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resident_note" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "type" VARCHAR(100),
    "note" VARCHAR(1000),
    "severity" VARCHAR(100),
    "resident_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "resident_note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_documents" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "type" VARCHAR(100),
    "path" VARCHAR(500),
    "description" VARCHAR(1000),
    "url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "master_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intermediate_documents" (
    "id" SERIAL NOT NULL,
    "master_document_id" INTEGER,
    "status" VARCHAR(50),
    "resident_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "intermediate_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resident_story" (
    "id" SERIAL NOT NULL,
    "lifestyle_preference" JSONB,
    "health_wellness" JSONB,
    "life_story" JSONB,
    "social_participation" JSONB,
    "resident_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "resident_story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careplan" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "instruction" VARCHAR(1000),
    "category" VARCHAR(255),
    "schedule" VARCHAR(255),
    "frequency" INTEGER,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "resident_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "careplan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vitals" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3),
    "time" VARCHAR(50),
    "weight" DOUBLE PRECISION,
    "temperature" DOUBLE PRECISION,
    "temperature_type" VARCHAR(50),
    "pulse" DOUBLE PRECISION,
    "blood_pressure" DOUBLE PRECISION,
    "blood_pressure_position" VARCHAR(50),
    "respiratory_rate" DOUBLE PRECISION,
    "oxygen_saturation" DOUBLE PRECISION,
    "oxygen_saturation_unit" VARCHAR(50),
    "blood_sugar" DOUBLE PRECISION,
    "blood_sugar_condition" VARCHAR(100),
    "note" VARCHAR(1000),
    "resident_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "vitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" SERIAL NOT NULL,
    "note_name" VARCHAR(255),
    "tags" JSONB,
    "date" TIMESTAMP(3),
    "time" VARCHAR(50),
    "status" VARCHAR(50),
    "resident_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" SERIAL NOT NULL,
    "incident" VARCHAR(1000),
    "tags" JSONB,
    "incident_date" TIMESTAMP(3),
    "incident_time" VARCHAR(50),
    "location" VARCHAR(255),
    "related_injuries" VARCHAR(1000),
    "notify" JSONB,
    "resident_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "start_date" TIMESTAMP(3),
    "start_time" VARCHAR(50),
    "duration" VARCHAR(100),
    "assigned_staff" VARCHAR(255),
    "notify" VARCHAR(255),
    "note" VARCHAR(1000),
    "resident_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp" (
    "id" SERIAL NOT NULL,
    "otp_value" VARCHAR(10),
    "user_id" INTEGER,
    "max_retries" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit" (
    "id" SERIAL NOT NULL,
    "method" VARCHAR(20),
    "end_point" VARCHAR(500),
    "ip_address" VARCHAR(100),
    "request_body" JSONB,
    "response_body" JSONB,
    "status_code" INTEGER,
    "request_headers" JSONB,
    "response_time_ms" INTEGER,
    "user_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admission_details" (
    "id" SERIAL NOT NULL,
    "community" VARCHAR(255),
    "move_in_date" TIMESTAMP(3),
    "is_as_soon_as_possible" BOOLEAN NOT NULL DEFAULT false,
    "summary_notes" VARCHAR(2000),
    "resident_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "admission_details_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "facility" ADD CONSTRAINT "facility_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room" ADD CONSTRAINT "room_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resident" ADD CONSTRAINT "resident_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resident" ADD CONSTRAINT "resident_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resident" ADD CONSTRAINT "resident_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsible_person" ADD CONSTRAINT "responsible_person_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsible_person" ADD CONSTRAINT "responsible_person_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_quick_risk" ADD CONSTRAINT "clinical_quick_risk_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payer_authorization" ADD CONSTRAINT "payer_authorization_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medication" ADD CONSTRAINT "medication_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prn_baseline" ADD CONSTRAINT "prn_baseline_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_services" ADD CONSTRAINT "order_services_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intermediate_room_resident" ADD CONSTRAINT "intermediate_room_resident_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intermediate_room_resident" ADD CONSTRAINT "intermediate_room_resident_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_signature" ADD CONSTRAINT "assessment_signature_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "downtime_mar" ADD CONSTRAINT "downtime_mar_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "downtime_mar" ADD CONSTRAINT "downtime_mar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "downtime_mar" ADD CONSTRAINT "downtime_mar_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_factor" ADD CONSTRAINT "risk_factor_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resident_note" ADD CONSTRAINT "resident_note_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intermediate_documents" ADD CONSTRAINT "intermediate_documents_master_document_id_fkey" FOREIGN KEY ("master_document_id") REFERENCES "master_documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intermediate_documents" ADD CONSTRAINT "intermediate_documents_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resident_story" ADD CONSTRAINT "resident_story_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "careplan" ADD CONSTRAINT "careplan_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vitals" ADD CONSTRAINT "vitals_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp" ADD CONSTRAINT "otp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit" ADD CONSTRAINT "audit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admission_details" ADD CONSTRAINT "admission_details_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
