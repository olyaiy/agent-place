// app/agents/new-agent/page.tsx
import { db } from "@/db/connection";
import { agents } from "@/db/schema/agents";
import { models } from "@/db/schema/models";
import { providers } from "@/db/schema/providers";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/utils";
import { eq } from "drizzle-orm";
import AgentForm from "@/components/agent-form";

export default async function NewAgentPage() {
  // Fetch available models and providers for select options
  const allModels = await db.select().from(models);
  const allProviders = await db.select().from(providers);

  async function createAgent(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const modelId = formData.get("modelId") as string;
    const providerId = formData.get("providerId") as string;
    const description = formData.get("description") as string;
    const visibility = formData.get("visibility") as string; // New visibility field

    // Get UUID references for model and provider
    const model = await db.query.models.findFirst({
      where: eq(models.model, modelId),
    });
    const provider = await db.query.providers.findFirst({
      where: eq(providers.provider, providerId),
    });

    await db.insert(agents).values({
      agent_display_name: name,
      system_prompt: formData.get("systemPrompt") as string,
      description,
      model: model?.id || null,
      provider: provider?.id || null,
      visibility, // Save the visibility value
      agent: slugify(name),
    });

    redirect("/agents");
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Create New Agent</h1>
      <AgentForm
        models={allModels}
        providers={allProviders}
        onSubmit={createAgent}
        submitLabel="Create Agent"
      />
    </>
  );
}
