import { pgTable, uuid, text, timestamp, integer, index, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { agents } from "./agents";
import { user } from "./auth-schema";

// Create enum for message roles (alternative to CREATE TYPE)
export const messageRole = pgEnum('message_role', ['system', 'user', 'assistant', 'tool']);

export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  agentId: uuid("agent_id").notNull().references(() => agents.id),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
  metadata: jsonb("metadata").default({}),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_conversations_user_id").on(table.userId),
  index("idx_conversations_agent_id").on(table.agentId),
  index("idx_conversations_last_message_at").on(table.lastMessageAt)
]);

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id").notNull().references(() => conversations.id),
  role: messageRole("role").notNull(),
  content: text("content"),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  tokensUsed: integer("tokens_used"),
  metadata: jsonb("metadata").default({}),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_messages_conversation_id").on(table.conversationId),
  index("idx_messages_created_at").on(table.createdAt),
  index("idx_messages_position").on(table.conversationId, table.position),
  index("idx_messages_role").on(table.role)
]);

export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect; 