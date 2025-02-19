import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";
import { models } from "./models";
import { providers } from "./providers";

export const agents = pgTable("agents", {
  id: uuid("id").defaultRandom().primaryKey(),
  agentId: varchar("agent_id", { length: 255 }).notNull().unique().default("temp_slug"),
  name: varchar("name", { length: 255 }).notNull(),
  systemPrompt: text("system_prompt").notNull(),
  modelId: uuid("model_id").references(() => models.id, { onDelete: "set null" }),
  providerId: uuid("provider_id").references(() => providers.id, { onDelete: "set null" }),
});

export type Agent = typeof agents.$inferSelect;
