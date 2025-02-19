'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Agent } from '../../db/schema/agents';
import { Settings } from "lucide-react";

export function AgentList({ items }: { items: Agent[] }) {
  const [agents, setAgents] = useState(items);

  useEffect(() => {
    setAgents(items);
  }, [items]);

  return (
    <div className="flex flex-wrap gap-4">
      {agents.map((agent) => (
        <div
          key={agent.id}
          className="w-64 p-4 border rounded-lg hover:bg-gray-50 transition-colors relative group"
        >
          <Link href={`/${agent.agentId}`} className="block mb-2">
            <h3 className="font-medium">{agent.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              {agent.systemPrompt}
            </p>
          </Link>
          
          <Link
            href={`/agents/${agent.agentId}`}
            className="absolute top-2 right-2 p-1  transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <Settings className="w-4 h-4 text-gray-500 hover:text-gray-700" />
          </Link>
        </div>
      ))}

<Link href="/agents/new-agent" className="w-64">
        <div className="h-full p-4 border rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2">
          <div className="text-2xl font-bold">+</div>
          <p className="text-sm text-center">Create New Agent</p>
        </div>
      </Link>
    </div>
  );
} 