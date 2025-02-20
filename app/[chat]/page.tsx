import { notFound } from "next/navigation"
import { agents } from "@/db/schema/agents"
import { db } from "@/db/connection"
import { eq } from "drizzle-orm"
import { NewChatInterface } from "@/components/new-chat-interface"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

async function getAgentBySlug(slug: string) {
  // Replace with actual database query
  const agent = await db.select().from(agents).where(eq(agents.agent, slug))
  return agent[0]
}

export default async function Page({
  params,
}: {
  params: { chat: string }
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    
    // console.log("The user id is", session?.user?.id)

  // Destructure after awaiting params
  const { chat } = await params
  const agent = await getAgentBySlug(chat)
  
  if (!agent) {
    notFound()
  }

  return (
    <div className="container max-w-3xl mx-auto h-full bg-red-500/10 flex flex-col justify-center items-center">
      <NewChatInterface 
      agentId={agent.id}
      agentName={agent.agent_display_name} 
      userId={session?.user?.id ?? ""}
      chat={chat}
      />
    </div>
  )
}
