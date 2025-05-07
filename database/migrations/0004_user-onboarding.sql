CREATE TABLE "user_onboarding" (
	"user_id" varchar NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"current_step" varchar DEFAULT 'welcome' NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "user_onboarding_user_id_pk" PRIMARY KEY("user_id")
);
