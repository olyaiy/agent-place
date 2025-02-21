'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Agent } from '../../db/schema/agents';
import { Settings, Plus } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AgentList({ items }: { items: Agent[] }) {
  const [agents, setAgents] = useState(items);
  const router = useRouter();

  useEffect(() => {
    setAgents(items);
  }, [items]);

  // If you want a consistent grey gradient, ignore the id:
  const getGradientBackground = () =>
    'linear-gradient(135deg, hsl(0, 0%, 85%) 0%, hsl(0, 0%, 65%) 100%)';
  
  // Or, if you want to vary the gradient based on the agent id:
  // const getGradientBackground = (id: number) => {
  //   const hue = (id * 60) % 360;
  //   return `linear-gradient(135deg, hsl(${hue}, 15%, 85%) 0%, hsl(${hue}, 15%, 65%) 100%)`;
  // };

  const handleCardClick = (agentPath: string, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.settings-button')) {
      return;
    }
    router.push(`/${agentPath}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {agents.map((agent) => (
        <Card 
          key={agent.id} 
          className="relative h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
          onClick={(e) => handleCardClick(agent.agent, e)}
        >
          <Link
            href={`/agents/${agent.agent}`}
            className="settings-button absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white/90">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>

          <div 
            className="h-32 rounded-t-lg"
            style={{
              background: agent.image_url 
                ? `${getGradientBackground()}, url(${agent.image_url}) center/cover no-repeat`
                : getGradientBackground()
            }}
          />

          <CardHeader className="space-y-1 pt-4">
            <div className="flex items-start">
              <h3 className="font-semibold text-lg line-clamp-1">
                {agent.agent_display_name}
              </h3>
            </div>
            {agent.type && (
              <Badge variant="secondary" className="w-fit">
                {agent.type}
              </Badge>
            )}
          </CardHeader>

          <CardContent>
            <p className="text-sm text-gray-500 line-clamp-2">
              {agent.description || "No description available"}
            </p>
          </CardContent>
        </Card>
      ))}

      <Link href="/agents/new-agent" className="block h-full">
        <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <Plus className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="font-semibold text-lg">Create New Agent</h3>
            <p className="text-sm text-gray-500 text-center">
              Add a new agent to your workspace
            </p>
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default AgentList;
