import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const providers = pgTable("providers", {
  id: uuid("id").defaultRandom().primaryKey(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  providerName: varchar("provider_name", { length: 255 }).notNull(),
});
