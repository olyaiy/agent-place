'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Agent } from '../../db/schema/agents';

export function AgentList({ items }: { items: Agent[] }) {
  const [agents, setAgents] = useState(items);

  useEffect(() => {
    setAgents(items);
  }, [items]);

  return (
    <div className="flex flex-wrap gap-4">
      {agents.map((agent) => (
        <Link
          key={agent.id}
          href={`/${agent.agentId}`}
          className="w-64 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <h3 className="font-medium">{agent.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{agent.systemPrompt}</p>
        </Link>
      ))}
    </div>
  );
} 