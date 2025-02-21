ALTER TABLE "providers" DROP CONSTRAINT "providers_id_unique";--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "creator_id" text;--> statement-breakpoint
ALTER TABLE "agents" ADD CONSTRAINT "agents_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;