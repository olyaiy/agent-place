import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { sql } from "drizzle-orm";

export const session = pgTable("session", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()::text`),
  userId: varchar("user_id", { length: 255 })
    .references(() => user.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: varchar("ip_address", { length: 255 }),
  userAgent: varchar("user_agent", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});

export type Session = typeof session.$inferSelect; 