import { db } from "@/db/connection";
import { conversations } from "@/db/schema/chat-schema"; // Update path if different
import { agents } from "@/db/schema/agents";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  const userConversations = await db
    .select({ 
      id: conversations.id, 
      title: conversations.title,
      agentSlug: agents.agent // Add agent slug from joined table
    })
    .from(conversations)
    .innerJoin(agents, eq(conversations.agentId, agents.id))
    .where(eq(conversations.userId, userId));

  return NextResponse.json(userConversations);
}
