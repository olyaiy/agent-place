import { db } from '@/db/connection';
import { agents } from '@/db/schema/agents';
import { eq } from 'drizzle-orm';

import { providers } from '@/db/schema/providers';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";

import { models } from '@/db/schema/models';
import ChatInterface from '@/app/components/chatbot/chat-interface';
import { messages } from '@/db/schema/chat-schema';


export default async function ChatPage({ params }: { params: Promise<{ 
  chat: string;
  'chat-id': string; // Matches dynamic route segment name
}> }) {
  const resolvedParams = await params;
  const chat = resolvedParams.chat;
  const chatId = resolvedParams['chat-id']; // Properly access hyphenated param

  const conversationMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, chatId))
    .orderBy(messages.position);


  const result = await db
    .select({
      agent: agents,
      providerName: providers.provider,
      modelName: models.model,
    })
    .from(agents)
    .leftJoin(providers, eq(agents.provider, providers.id))
    .leftJoin(models, eq(agents.model, models.id))
    .where(eq(agents.agent, chat))
    .limit(1);

  if (!result[0]?.agent) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Agent Not Found</h1>
        <p className="mt-2 text-gray-600">
          The agent with ID {chat} could not be found.
        </p>
      </div>
    );
  }

  const data = result[0].agent;
  const providerName = result[0].providerName;
  const modelName = result[0].modelName;

  if (!providerName) {
    return <div>Invalid provider: {data.provider}</div>;
  }

  if (!modelName) {
    return <div>Model ID is required</div>;
  }

  // Filter messages to only include allowed roles before passing to ChatInterface
  const filteredMessages = conversationMessages
    .filter(m => ['user', 'assistant'].includes(m.role))
    .map(m => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      content: m.content || '',
      position: m.position,
      createdAt: m.createdAt
    }));

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <h1 className="text-lg font-semibold ml-14">{data.agent_display_name}</h1>
          <div className="ml-auto">
            <Link href={`/agents/${data.agent}`}>
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
          initialMessages={filteredMessages}
          providerId={providerName}
          modelId={modelName}
          systemPrompt={data.system_prompt}
          chatId={chatId}
        />
      </div>
    </div>
  );
}
