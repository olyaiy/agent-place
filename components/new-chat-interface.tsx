"use client"

import { useState } from "react"
import { MessageInput } from "@/components/ui/message-input"
import { createConversation } from "@/app/[chat]/actions"
import { useRouter } from "next/navigation"

export function NewChatInterface({
  agentName,
  userId,
  agentId,
  chat
}: {
  agentName: string;
  userId: string;
  agentId: string;
  chat: string;
}) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const conversationId = await createConversation(userId, agentName, inputValue, agentId)
    setInputValue("")
    router.push(`/${chat}/${conversationId}`)
  }

  return (
    <div className="flex flex-col  w-full bg-green-500/10">
      <h1 className="text-2xl font-bold mb-8 text-center">{agentName}</h1>
      <div className="flex-1" /> {/* Spacer */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form onSubmit={handleSubmit}>
          <MessageInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            allowAttachments={false}
            isGenerating={false}
            className="max-w-3xl mx-auto"
          />
        </form>
      </div>
    </div>
  )
} 