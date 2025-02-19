import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { providers } from "./providers"; // Importing related schema

export const models = pgTable("models", {
  id: uuid("id").defaultRandom().primaryKey(),
  modelName: varchar("model_name", { length: 255 }).notNull(),
  modelId: varchar("model_id", { length: 255 }).notNull(),
  providerId: uuid("provider_id").references(() => providers.id, { onDelete: "cascade" }),
});

export type Model = typeof models.$inferSelect;
