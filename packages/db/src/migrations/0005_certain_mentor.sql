CREATE TABLE "volunteer" (
	"user_id" text PRIMARY KEY NOT NULL,
	"description" text,
	"city" varchar(100),
	"past_works" text[] DEFAULT '{}' NOT NULL,
	"bio" text,
	"is_open_to_work" boolean DEFAULT false NOT NULL,
	"wants_to_start_org" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "volunteer_tags" (
	"volunteer_id" text NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "volunteer_tags_pk" PRIMARY KEY("volunteer_id","tag_id")
);
--> statement-breakpoint
ALTER TABLE "volunteer" ADD CONSTRAINT "volunteer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer_tags" ADD CONSTRAINT "volunteer_tags_volunteer_id_volunteer_user_id_fk" FOREIGN KEY ("volunteer_id") REFERENCES "public"."volunteer"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer_tags" ADD CONSTRAINT "volunteer_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_volunteer_city" ON "volunteer" USING btree ("city");--> statement-breakpoint
CREATE INDEX "idx_volunteer_tags_tag_id" ON "volunteer_tags" USING btree ("tag_id");