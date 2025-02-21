'use client';

import { authClient } from "@/lib/auth-client";
import useSWR from "swr";
import Link from "next/link";
import { usePathname } from "next/navigation";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function Sidebar() {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  // Assuming the URL is in the format: /[agentSlug]/[conversationId]
  const segments = pathname.split("/");
  const currentConversationId = segments[2];

  const { data: conversations } = useSWR(
    session?.user?.id ? `/api/conversations?userId=${session.user.id}` : null,
    fetcher
  );

  if (!session) return null;

  return (
    <div className="w-64 sta left-0 top-0 h-screen border-r p-4">
      <h2 className="text-lg font-semibold mb-4">Conversations</h2>
      <nav className="space-y-2">
        {conversations?.map((conv: { id: string; title: string; agentSlug: string }) => {
          const isActive = currentConversationId === conv.id;
          return (
            <Link
              key={conv.id}
              href={`/${conv.agentSlug}/${conv.id}`}
              className={`block p-2 rounded transition-colors ${
                isActive ? "bg-gray-300" : "hover:bg-gray-100"
              }`}
            >
              {conv.title || "Untitled Conversation"}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
