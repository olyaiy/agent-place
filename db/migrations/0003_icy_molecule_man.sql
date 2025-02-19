ALTER TABLE "agents" DROP CONSTRAINT "agents_model_id_models_id_fk";
--> statement-breakpoint
ALTER TABLE "agents" DROP CONSTRAINT "agents_provider_id_providers_id_fk";
--> statement-breakpoint
ALTER TABLE "agents" ALTER COLUMN "model_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "agents" ALTER COLUMN "provider_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "agents" ADD CONSTRAINT "agents_model_id_models_model_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("model_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agents" ADD CONSTRAINT "agents_provider_id_providers_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("provider_id") ON DELETE set null ON UPDATE no action;