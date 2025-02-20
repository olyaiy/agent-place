'use client';

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import Link from "next/link";

export function Sidebar() {
  const { data: session } = authClient.useSession();
  const [conversations, setConversations] = useState<Array<{
    id: string;
    title: string;
    agentSlug: string;
  }>>([]);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/conversations?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => setConversations(data));
    }
  }, [session?.user?.id]);

  if (!session) return null;

  return (
    <div className="w-64 sta left-0 top-0 h-screen border-r p-4">
      <h2 className="text-lg font-semibold mb-4">Conversations</h2>
      <nav className="space-y-2">
        {conversations.map((conv) => (
          <Link
            key={conv.id}
            href={`/${conv.agentSlug}/${conv.id}`}
            className="block p-2 hover:bg-gray-100 rounded transition-colors"
          >
            {conv.title || "Untitled Conversation"}
          </Link>
        ))}
      </nav>
    </div>
  );
} 