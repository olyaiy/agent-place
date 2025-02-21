// new-chat-interface.tsx
"use client";

import { useState, useEffect } from "react";
import { MessageInput } from "@/components/ui/message-input";
import { createConversation } from "@/app/[chat]/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { mutate } from "swr";
import { authClient } from "@/lib/auth-client"; // assuming this provides your session

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

  // Use your auth hook to get the current session
  const { data: session } = authClient.useSession();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // If the user is not signed in, redirect them to the auth modal
    if (!session) {
      // Build a callback URL that sends them back to this page with their prompt preserved
      const callbackUrl = `${window.location.pathname}?prompt=${encodeURIComponent(
        inputValue
      )}`;
      router.push(
        `/auth-form?callbackUrl=${encodeURIComponent(callbackUrl)}`
      );
      return;
    }

    // If the user is authenticated, proceed as usual
    const conversationId = await createConversation(
      userId,
      agentName,
      inputValue,
      agentId
    );

    // Immediately clear the input if needed
    setInputValue("");

    // Refresh the conversation list
    mutate(`/api/conversations?userId=${userId}`);

    // Redirect to the new conversation
    router.push(`/${chat}/${conversationId}`);
  }

  return (
    <div className="flex flex-col w-full bg-green-500/10">
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
  );
}
