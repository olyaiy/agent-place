
// app/agents/[agent]/page.tsx
import { db } from "@/db/connection";
import { agents } from "@/db/schema/agents";
import { models } from "@/db/schema/models";
import { providers } from "@/db/schema/providers";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/utils";
import AgentForm from "@/components/agent-form";

export default async function AgentEditPage({
  params,
}: {
  params: Promise<{ agent: string }>;
}) {
  const resolvedParams = await params;

  // Fetch current agent data
  const [agent] = await db
    .select()
    .from(agents)
    .where(eq(agents.agent, resolvedParams.agent));

  if (!agent) {
    redirect("/agents");
  }

  // Fetch available models and providers
  const allModels = await db.select().from(models);
  const allProviders = await db.select().from(providers);

  async function updateAgent(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    // Generate new agent id only if the name changed
    const newAgentId =
      name === agent.agent_display_name ? agent.agent : slugify(name);

    await db
      .update(agents)
      .set({
        agent_display_name: name,
        system_prompt: formData.get("systemPrompt") as string,
        model: formData.get("modelId") as string || null,
        provider: formData.get("providerId") as string || null,
        visibility: formData.get("visibility") as "public" | "private" | "link",
        agent: newAgentId,
      })
      .where(eq(agents.id, agent.id));

    redirect(`/agents/${newAgentId}`);
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Edit Agent</h1>
      <AgentForm
        defaultValues={{
          id: agent.id,
          name: agent.agent_display_name,
          description: agent.description || "",
          systemPrompt: agent.system_prompt,
          modelId: agent.model || "",
          providerId: agent.provider || "",
          visibility: agent.visibility || "public",
        }}
        models={allModels}
        providers={allProviders}
        onSubmit={updateAgent}
        submitLabel="Save Changes"
      />
    </>
  );
}

