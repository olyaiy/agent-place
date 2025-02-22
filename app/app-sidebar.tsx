'use client';

import { authClient } from "@/lib/auth-client";
import useSWR from "swr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function AppSidebar() {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const segments = pathname.split("/");
  const currentConversationId = segments[2];

  // Fetch conversations for the logged-in user.
  const { data: conversations = [], mutate } = useSWR(
    session?.user?.id ? `/api/conversations?userId=${session.user.id}` : null,
    fetcher
  );

  // Use optimistic state to immediately show the active conversation.
  const [optimisticConversationId, setOptimisticConversationId] = useState(currentConversationId);
  useEffect(() => {
    setOptimisticConversationId(currentConversationId);
  }, [currentConversationId]);

  // Handle conversation deletion.
  const handleDelete = useCallback(
    async (e: React.MouseEvent, conversationId: string) => {
      e.stopPropagation();
      e.preventDefault();

      if (!confirm("Are you sure you want to delete this conversation?")) {
        return;
      }

      const previousConversations = [...conversations];
      // Optimistically remove the conversation.
      mutate(
        (current: typeof conversations) =>
          current.filter((c) => c.id !== conversationId),
        false
      );

      try {
        const res = await fetch(`/api/conversations/${conversationId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          throw new Error("Error deleting conversation on the server.");
        }
        mutate();
      } catch (error) {
        console.error("Error deleting conversation:", error);
        // Rollback on error.
        mutate(previousConversations, false);
      }
    },
    [conversations, mutate]
  );

  if (!session) return null;

  return (
    <Sidebar variant="floating">
        
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Conversations</SidebarGroupLabel>
          <SidebarMenu>
            {conversations.length === 0 ? (
              <SidebarMenuItem>
                <div className="text-gray-500">No conversations to show</div>
              </SidebarMenuItem>
            ) : (
              conversations.map((conv) => {
                const isActive = optimisticConversationId === conv.id;
                return (
                  <SidebarMenuItem key={conv.id}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        href={`/${conv.agentSlug}/${conv.id}`}
                        onClick={() => setOptimisticConversationId(conv.id)}
                      >
                        {conv.title || "Untitled Conversation"}
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      onClick={(e) => handleDelete(e, conv.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v0a1 1 0 01-1 1H9a1 1 0 01-1-1v0a1 1 0 011-1z"
                        />
                      </svg>
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                );
              })
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
