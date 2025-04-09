ALTER TABLE "anti_echinococcus_treatments" ALTER COLUMN "manufacturer" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "anti_echinococcus_treatments" ALTER COLUMN "administered_on" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "anti_parasite_treatments" ALTER COLUMN "manufacturer" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "anti_parasite_treatments" ALTER COLUMN "administered_on" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "vaccinations" ALTER COLUMN "valid_from" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "anti_echinococcus_treatments" ADD COLUMN "valid_until" date;--> statement-breakpoint
ALTER TABLE "anti_parasite_treatments" ADD COLUMN "valid_until" date;--> statement-breakpoint
ALTER TABLE "vaccinations" ADD CONSTRAINT "rabies_required_valid_from" CHECK (("vaccinations"."type" = 'rabies' AND "vaccinations"."valid_from" IS NOT NULL) OR ("vaccinations"."type" != 'rabies'));