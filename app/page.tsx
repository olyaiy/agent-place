import { db } from '../db/connection';
import { providers } from '../db/schema/providers';
import { models } from '../db/schema/models';
import { agents } from '../db/schema/agents';
import { ProviderList } from './components/ProviderList';
import { ModelList } from './components/ModelList';
import { AgentList } from './components/AgentList';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

async function Providers() {
  const data = await db.select().from(providers);
  return (
    <section className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">AI Providers</h2>
      <ProviderList items={data} />
    </section>
  );
}

async function Models() {
  const data = await db.select().from(models);
  return (
    <section className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">AI Models</h2>
      <ModelList items={data} />
    </section>
  );
}

async function Agents() {
  // Retrieve the current session
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;

  // Use Drizzle's relational query API to find agents based on the condition:
  // If user is logged in, include agents that are public or were created by the user.
  // Otherwise, only return agents that are public.
  const data = await db.query.agents.findMany({
    where: (agents, { eq, or }) =>
      userId
        ? or(eq(agents.visibility, "public"), eq(agents.creatorId, userId))
        : eq(agents.visibility, "public"),
  });

  return (
    <section className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">AI Agents</h2>
      <AgentList items={data} />
    </section>
  );
}



export default function Home() {
  return (
    <main className="space-y-8">
      {/* <Providers /> */}
      {/* <Models /> */}
      <Agents />
    </main>
  );
}
