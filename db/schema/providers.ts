import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const providers = pgTable("providers", {
  id: uuid("id").defaultRandom().primaryKey(),
  provider: varchar("provider", { length: 255 }).notNull().unique(),
  provider_display_name: varchar("provider_display_name", { length: 255 }).notNull(),
});

export type Provider = typeof providers.$inferSelect;
