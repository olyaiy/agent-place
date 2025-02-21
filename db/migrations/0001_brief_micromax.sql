CREATE TYPE "public"."visibility" AS ENUM('public', 'private', 'link');--> statement-breakpoint
ALTER TABLE "models" DROP CONSTRAINT "models_id_unique";--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "visibility" "visibility" DEFAULT 'public';