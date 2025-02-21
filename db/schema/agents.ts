import { pgTable, uuid, varchar, text, pgEnum } from "drizzle-orm/pg-core";
import { models } from "./models";
import { providers } from "./providers";
import { user } from "./auth-schema";

export const visibilityEnum = pgEnum("visibility", ["public", "private", "link"]);


export const agents = pgTable("agents", {
  id: uuid("id").defaultRandom().primaryKey(),
  agent: varchar("agent", { length: 255 }).notNull().unique().default("temp_slug"),
  agent_display_name: varchar("agent_display_name", { length: 255 }).notNull(),
  system_prompt: text("system_prompt").notNull(),
  description: text("description"),
  model: uuid("model").references(() => models.id),
  provider: uuid("provider").references(() => providers.id),
  visibility: visibilityEnum("visibility").default("public"),
  creatorId: text("creator_id").references(() => user.id),

});

export type Agent = typeof agents.$inferSelect;
