import { sql } from "drizzle-orm";
import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const verifications = pgTable("verification", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()::text`),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});

export type Verification = typeof verifications.$inferSelect; 