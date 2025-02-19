ALTER TABLE "agents" ADD COLUMN "agent_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "agents" ADD CONSTRAINT "agents_agent_id_unique" UNIQUE("agent_id");