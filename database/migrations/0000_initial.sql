CREATE TYPE "public"."pet_marking_type" AS ENUM('microchip', 'tattoo');--> statement-breakpoint
CREATE TYPE "public"."pet_sex" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."pet_species" AS ENUM('dog', 'cat');--> statement-breakpoint
CREATE TYPE "public"."vaccination_type" AS ENUM('rabies', 'other');--> statement-breakpoint
CREATE TABLE "anti_echinococcus_treatments" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"manufacturer" varchar(255) NOT NULL,
	"administered_on" date NOT NULL,
	"administered_by" integer,
	"pet_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "anti_echinococcus_treatments_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "anti_parasite_treatments" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"manufacturer" varchar(255) NOT NULL,
	"administered_on" date NOT NULL,
	"administered_by" integer,
	"pet_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "anti_parasite_treatments_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "clinical_examinations" (
	"id" serial NOT NULL,
	"date" date NOT NULL,
	"veterinarian_id" integer NOT NULL,
	"pet_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "clinical_examinations_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "owners" (
	"id" serial NOT NULL,
	"external_id" varchar(255),
	"firstname" varchar(255) NOT NULL,
	"lastname" varchar(255) NOT NULL,
	"address" text NOT NULL,
	"city" varchar(255) NOT NULL,
	"country" varchar(255) NOT NULL,
	"postcode" varchar(255),
	"phone" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "owners_id_pk" PRIMARY KEY("id"),
	CONSTRAINT "owners_externalId_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "passports" (
	"id" serial NOT NULL,
	"serial_number" varchar(255) NOT NULL,
	"issue_date" date NOT NULL,
	"issued_by" integer NOT NULL,
	"pet_id" integer NOT NULL,
	"owner1_id" integer NOT NULL,
	"owner2_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "passports_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "pet_markings" (
	"id" integer NOT NULL,
	"code" varchar(255) NOT NULL,
	"place" varchar(255) NOT NULL,
	"type" "pet_marking_type" DEFAULT 'microchip' NOT NULL,
	"application_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "pet_markings_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "pets" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"dob" date NOT NULL,
	"sex" "pet_sex" NOT NULL,
	"species" "pet_species" NOT NULL,
	"breed" varchar(255) NOT NULL,
	"colors" varchar(255)[] DEFAULT '{}' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "pets_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "vaccinations" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"manufacturer" varchar(255) NOT NULL,
	"lot_number" varchar(255) NOT NULL,
	"expiry_date" date NOT NULL,
	"administered_on" date NOT NULL,
	"administered_by" integer NOT NULL,
	"valid_from" date NOT NULL,
	"valid_until" date NOT NULL,
	"pet_id" integer NOT NULL,
	"type" "vaccination_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "vaccinations_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "veterinarians" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text NOT NULL,
	"postcode" varchar(255),
	"city" varchar(255) NOT NULL,
	"country" varchar(255) NOT NULL,
	"phone" varchar(255),
	"email" varchar(255),
	"website" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "veterinarians_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
ALTER TABLE "anti_echinococcus_treatments" ADD CONSTRAINT "anti_echinococcus_treatments_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "anti_echinococcus_treatments" ADD CONSTRAINT "anti_echinococcus_treatments_administered_by_veterinarians_id_fk" FOREIGN KEY ("administered_by") REFERENCES "public"."veterinarians"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "anti_parasite_treatments" ADD CONSTRAINT "anti_parasite_treatments_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "anti_parasite_treatments" ADD CONSTRAINT "anti_parasite_treatments_administered_by_veterinarians_id_fk" FOREIGN KEY ("administered_by") REFERENCES "public"."veterinarians"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "clinical_examinations" ADD CONSTRAINT "clinical_examinations_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "clinical_examinations" ADD CONSTRAINT "clinical_examinations_veterinarian_id_veterinarians_id_fk" FOREIGN KEY ("veterinarian_id") REFERENCES "public"."veterinarians"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "passports" ADD CONSTRAINT "passports_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "passports" ADD CONSTRAINT "passports_owner1_id_owners_id_fk" FOREIGN KEY ("owner1_id") REFERENCES "public"."owners"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "passports" ADD CONSTRAINT "passports_owner2_id_owners_id_fk" FOREIGN KEY ("owner2_id") REFERENCES "public"."owners"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "passports" ADD CONSTRAINT "passports_issued_by_veterinarians_id_fk" FOREIGN KEY ("issued_by") REFERENCES "public"."veterinarians"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "pet_markings" ADD CONSTRAINT "pet_markings_id_pets_id_fk" FOREIGN KEY ("id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_administered_by_veterinarians_id_fk" FOREIGN KEY ("administered_by") REFERENCES "public"."veterinarians"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
CREATE UNIQUE INDEX "passports_pet_id_index" ON "passports" USING btree ("pet_id") WHERE "passports"."deleted_at" IS NULL;