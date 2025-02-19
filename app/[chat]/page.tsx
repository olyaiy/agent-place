import { db } from '../../db/connection';
import { agents } from '../../db/schema/agents';
import { eq } from 'drizzle-orm';
import { openai } from '@ai-sdk/openai';
import ChatInterface from '../components/chatbot/chat-interface';



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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{data.name}</h1>
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">System Prompt</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{data.systemPrompt}</p>
        </div>
        {/* <MessageInput value={''} isGenerating={false}/> */}
        <ChatInterface providerId={data.providerId ?? 'openai'} modelId={data.modelId ?? 'gpt-4o-mini'} />
        <div>
          <h2 className="font-semibold">Agent ID</h2>
          <p className="text-gray-600">{data.agentId}</p>
          <p className="text-gray-600">{data.modelId}</p>
          <p className="text-gray-600">{data.providerId}</p>
        </div>
      </div>
    </div>
  );
}
