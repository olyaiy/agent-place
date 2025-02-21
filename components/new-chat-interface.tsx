// components/new-chat-interface.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mutate } from "swr";
import { authClient } from "@/lib/auth-client";
import { createConversation } from "@/app/[chat]/actions";
import { MessageInput } from "@/components/ui/message-input";
import { ChatSkeleton } from "@/components/chat-skeleton";

export function NewChatInterface({
  agentName,
  userId,
  agentId,
  chat,
}: {
  agentName: string;
  userId: string;
  agentId: string;
  chat: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";
  const [inputValue, setInputValue] = useState(initialPrompt);
  const [isCreating, setIsCreating] = useState(false);

  // Use your auth hook to get the current session
  const { data: session } = authClient.useSession();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // If the user is not signed in, redirect them to the auth modal
    if (!session) {
      const callbackUrl = `${window.location.pathname}?prompt=${encodeURIComponent(inputValue)}`;
      router.push(`/auth-form?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    // Switch to skeleton
    setIsCreating(true);

    try {
      const conversationId = await createConversation(
        userId,
        agentName,
        inputValue,
        agentId
      );
      mutate(`/api/conversations?userId=${userId}`);

      // Redirect to the new conversation
      router.push(`/${chat}/${conversationId}`);
    } catch (err) {
      console.error("Failed to create conversation:", err);
      // If creation failed, revert to normal UI
      setIsCreating(false);
    }
  }

  if (isCreating) {
    return <ChatSkeleton userMessage={inputValue} />;
  }

  

  return (
    <div className="flex flex-col w-full max-w-3xl mb-60">
      <h1 className="text-2xl font-bold mb-8 text-center">{agentName}</h1>
      <div className="flex-1" />
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
  );
}
