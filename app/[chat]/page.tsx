import { db } from '../../db/connection';
import { agents } from '../../db/schema/agents';
import { eq } from 'drizzle-orm';
import { openai } from '@ai-sdk/openai';
import ChatInterface from '../components/chatbot/chat-interface';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";

const providers = {
  openai,
  // Add other providers as needed
};

export default async function ChatPage({ params }: { params: { chat: string } }) {
  const { chat } = await params;
  const data = await db.query.agents.findFirst({
    where: eq(agents.agentId, chat),
  });

  if (!data) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Agent Not Found</h1>
        <p className="mt-2 text-gray-600">
          The agent with ID {chat} could not be found.
        </p>
      </div>
    );
  }

  const providerFn = providers[data.providerId as keyof typeof providers];
  if (!providerFn) {
    return <div>Invalid provider: {data.providerId}</div>;
  }

  if (!data.modelId) {
    return <div>Model ID is required</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)]">
      <div className="flex-none border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <h1 className="text-lg font-semibold ml-14">{data.name}</h1>
          <div className="ml-auto">
            <Link href={`/agents/${data.agentId}`}>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted"
                title="Agent settings"
              >
                <SettingsIcon className="h-5 w-5" />
                <span className="sr-only">Agent Settings</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ChatInterface 
          providerId={data.providerId ?? 'openai'} 
          modelId={data.modelId ?? 'gpt-4-mini'}
          systemPrompt={data.systemPrompt}
        />
      </div>
    </div>
  );
}
