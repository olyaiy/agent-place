import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { providers } from "./providers"; // Importing related schema

export const models = pgTable("models", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  model_display_name: varchar("model_display_name", { length: 255 }).notNull(),
  model: varchar("model", { length: 255 }).notNull().unique(),
  provider: uuid("provider").references(() => providers.id, { onDelete: "cascade" }),
});

export type Model = typeof models.$inferSelect;
