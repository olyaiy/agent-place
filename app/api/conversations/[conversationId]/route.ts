// app/api/conversations/[conversationId]/route.ts

import { db } from "@/db/connection";
import { conversations, messages } from "@/db/schema/chat-schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;

  // Delete all messages associated with the conversation
  await db.delete(messages).where(eq(messages.conversationId, conversationId));

  // Delete the conversation itself
  await db.delete(conversations).where(eq(conversations.id, conversationId));

  return NextResponse.json({ success: true });
}
