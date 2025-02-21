// components/chat-skeleton.tsx
"use client";

import React from "react";
import { ChatContainer, ChatMessages } from "@/components/ui/chat";
import { MessageList } from "@/components/ui/message-list";
import { Button } from "./ui/button";
import { MessageInput } from "./ui/message-input";

/**
 * Skeleton chat UI that displays the user’s typed message plus
 * the default "TypingIndicator" for the assistant.
 * Also shows a gray block at the bottom to mimic the input area.
 */
export function ChatSkeleton({ userMessage }: { userMessage: string }) {
  // Just one "fake" user message
  const skeletonMessages = [
    {
      id: "skeleton-user",
      role: "user" as const,
      content: userMessage || "Loading...",
    },
  ];

  return (

    <div className="flex flex-col h-full w-full ">
    <div className="flex-none border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <h1 className="text-lg font-semibold ml-14">
            New Convo
            {/* {data.agent_display_name} */}


        </h1>
        <div className="ml-auto">
          {/* <Link href={`/agents/${data.agent}`}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted"
              title="Agent settings"
            >
              <SettingsIcon className="h-5 w-5" />
              <span className="sr-only">Agent Settings</span>
            </Button>
          </Link> */}
        </div>
      </div>
    </div>
    
    <div className="flex-1 overflow-hidden">
    <ChatContainer className="h-full mt-4">
      <ChatMessages messages={skeletonMessages}>
        <div className="max-w-3xl mx-auto mt-auto">
          {/* Pass our single user message, plus set isTyping to true for the assistant */}
          <MessageList
            messages={skeletonMessages}
            isTyping={true}
            showTimeStamps={false}
          />
        </div>
      </ChatMessages>

      {/* Skeleton for the message input area */}
      <div className="flex-none bg-background/95 backdrop-blur p-0">
        <div className="max-w-3xl mx-auto px-4 py-3">
            <MessageInput
            isGenerating={true}
            />
        </div>
      </div>
    </ChatContainer>
    </div>
  </div>

   
  );
}
