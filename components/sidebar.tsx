'use client';

import { authClient } from "@/lib/auth-client";
import useSWR from "swr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function Sidebar() {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const segments = pathname.split("/");
  const currentConversationId = segments[2];

  // Track conversations
  const { data: conversations = [], mutate } = useSWR(
    session?.user?.id ? `/api/conversations?userId=${session.user.id}` : null,
    fetcher
  );

  // Minimal addition: store optimistic ID
  const [optimisticConversationId, setOptimisticConversationId] = useState(currentConversationId);

  // Whenever the actual route changes, sync the local state
  useEffect(() => {
    setOptimisticConversationId(currentConversationId);
  }, [currentConversationId]);

  const handleDelete = useCallback(
    async (e: React.MouseEvent, conversationId: string) => {
      e.stopPropagation();
      e.preventDefault();

      if (!confirm("Are you sure you want to delete this conversation?")) {
        return;
      }

      const previousConversations = [...conversations];
      mutate(
        (current: typeof conversations) => current.filter(c => c.id !== conversationId),
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
        mutate(previousConversations, false);
      }
    },
    [conversations, mutate]
  );

  if (!session) return null;

  return (
    <div className="w-64 sta left-0 top-0 h-screen border-r p-4 overflow-scroll">
      <h2 className="text-lg font-semibold mb-4">Conversations</h2>
      <nav className="space-y-2">
        {conversations.length === 0 ? (
          <p className="text-gray-500">No conversations to show</p>
        ) : (
          conversations.map((conv) => {
            // Use the optimistic ID instead of the server's route ID
            const isActive = optimisticConversationId === conv.id;

            return (
              <div key={conv.id} className="relative group">
                <Link
                  href={`/${conv.agentSlug}/${conv.id}`}
                  // On click, immediately set this conversation as active
                  onClick={() => setOptimisticConversationId(conv.id)}
                  className={`block p-2 rounded transition-colors duration-25 ${
                    isActive ? "bg-gray-300" : "hover:bg-gray-100"
                  }`}
                >
                  {conv.title || "Untitled Conversation"}
                </Link>
                <button
                  onClick={(e) => handleDelete(e, conv.id)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
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
                </button>
              </div>
            );
          })
        )}
      </nav>
    </div>
  );
}
