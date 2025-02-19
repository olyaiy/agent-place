import { db } from '../../db/connection';
import { agents } from '../../db/schema/agents';
import { eq } from 'drizzle-orm';

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{data.name}</h1>
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">System Prompt</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{data.systemPrompt}</p>
        </div>
        <div>
          <h2 className="font-semibold">Agent ID</h2>
          <p className="text-gray-600">{data.agentId}</p>
        </div>
      </div>
    </div>
  );
}
