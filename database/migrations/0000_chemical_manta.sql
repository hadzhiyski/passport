CREATE TYPE "public"."treatment_type" AS ENUM('ectoparasites', 'endoparasites');--> statement-breakpoint
CREATE TYPE "public"."pet_marking_type" AS ENUM('microchip', 'tattoo');--> statement-breakpoint
CREATE TYPE "public"."pet_sex" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."pet_species" AS ENUM('dog', 'cat');--> statement-breakpoint
CREATE TYPE "public"."vax_type" AS ENUM('rabies', 'other');--> statement-breakpoint
CREATE TABLE "anti_parasite_treatments" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"manufacturer" varchar(255),
	"administered_on" date NOT NULL,
	"valid_until" date NOT NULL,
	"type" "treatment_type" NOT NULL,
	"vet_id" integer,
	"pet_id" integer NOT NULL,
	CONSTRAINT "anti_parasite_treatments_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "examinations" (
	"id" serial NOT NULL,
	"declaration" text NOT NULL,
	"date" timestamp NOT NULL,
	"vet_id" integer NOT NULL,
	"pet_id" integer NOT NULL,
	CONSTRAINT "examinations_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "others" (
	"id" serial NOT NULL,
	"text" text NOT NULL,
	"pet_id" integer NOT NULL,
	CONSTRAINT "others_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "owners" (
	"id" serial NOT NULL,
	"external_id" varchar(255),
	"firstname" varchar(255) NOT NULL,
	"lastname" varchar(255) NOT NULL,
	"email" varchar(255),
	"address" text NOT NULL,
	"city" varchar(255) NOT NULL,
	"country" varchar(255) NOT NULL,
	"postcode" varchar(255),
	"phone" varchar(255),
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
	CONSTRAINT "passports_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "pet_markings" (
	"id" integer NOT NULL,
	"code" varchar(255) NOT NULL,
	"place" varchar(255) NOT NULL,
	"type" "pet_marking_type" DEFAULT 'microchip' NOT NULL,
	"application_date" date NOT NULL,
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
	CONSTRAINT "pets_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "vaxes" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"manufacturer" varchar(255) NOT NULL,
	"lot_number" varchar(255) NOT NULL,
	"expiry_date" date NOT NULL,
	"administered_on" date NOT NULL,
	"vet_id" integer NOT NULL,
	"valid_from" date,
	"valid_until" date NOT NULL,
	"pet_id" integer NOT NULL,
	"type" "vax_type" NOT NULL,
	CONSTRAINT "vaxes_id_pk" PRIMARY KEY("id"),
	CONSTRAINT "rabies_required_valid_from" CHECK (("vaxes"."type" = 'rabies' AND "vaxes"."valid_from" IS NOT NULL) OR ("vaxes"."type" != 'rabies'))
);
--> statement-breakpoint
CREATE TABLE "vets" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text NOT NULL,
	"postcode" varchar(255),
	"city" varchar(255) NOT NULL,
	"country" varchar(255) NOT NULL,
	"phone" varchar(255),
	"email" varchar(255),
	"website" varchar(255),
	CONSTRAINT "vets_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
ALTER TABLE "anti_parasite_treatments" ADD CONSTRAINT "anti_parasite_treatments_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "anti_parasite_treatments" ADD CONSTRAINT "anti_parasite_treatments_vet_id_vets_id_fk" FOREIGN KEY ("vet_id") REFERENCES "public"."vets"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "examinations" ADD CONSTRAINT "examinations_vet_id_vets_id_fk" FOREIGN KEY ("vet_id") REFERENCES "public"."vets"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "examinations" ADD CONSTRAINT "examinations_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "others" ADD CONSTRAINT "others_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "passports" ADD CONSTRAINT "passports_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "passports" ADD CONSTRAINT "passports_owner1_id_owners_id_fk" FOREIGN KEY ("owner1_id") REFERENCES "public"."owners"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "passports" ADD CONSTRAINT "passports_owner2_id_owners_id_fk" FOREIGN KEY ("owner2_id") REFERENCES "public"."owners"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "passports" ADD CONSTRAINT "passports_issued_by_vets_id_fk" FOREIGN KEY ("issued_by") REFERENCES "public"."vets"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "pet_markings" ADD CONSTRAINT "pet_markings_id_pets_id_fk" FOREIGN KEY ("id") REFERENCES "public"."pets"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "vaxes" ADD CONSTRAINT "vaxes_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "vaxes" ADD CONSTRAINT "vaxes_vet_id_vets_id_fk" FOREIGN KEY ("vet_id") REFERENCES "public"."vets"("id") ON DELETE restrict ON UPDATE restrict;