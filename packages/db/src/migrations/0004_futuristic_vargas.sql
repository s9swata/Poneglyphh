CREATE TABLE "organisation" (
	"user_id" text PRIMARY KEY NOT NULL,
	"tagline" varchar(160),
	"description" text,
	"country" varchar(100),
	"website" text,
	"social_links" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organisation" ADD CONSTRAINT "organisation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;