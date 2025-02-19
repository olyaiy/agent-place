import { db } from "@/db/connection";
import { agents } from "@/db/schema/agents";
import { models } from "@/db/schema/models";
import { providers } from "@/db/schema/providers";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { eq } from "drizzle-orm";

export default async function NewAgentPage() {
  // Fetch available models and providers for select options
  const allModels = await db.select().from(models);
  const allProviders = await db.select().from(providers);

  async function createAgent(formData: FormData) {
    "use server";
    
    const name = formData.get("name") as string;
    const modelId = formData.get("modelId") as string;
    const providerId = formData.get("providerId") as string;

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
      model: model?.id || null,
      provider: provider?.id || null,
      agent: slugify(name)
    });

    redirect("/agents");
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Agent</h1>
      <form action={createAgent} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="name">
            Agent Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="description">
            Description (optional)
          </label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            className="w-full p-2 border rounded-md"
            placeholder="Agent purpose and capabilities"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="systemPrompt">
            System Prompt
          </label>
          <textarea
            id="systemPrompt"
            name="systemPrompt"
            required
            rows={4}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="modelId">
              Model
            </label>
            <select
              id="modelId"
              name="modelId"
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select a model</option>
              {allModels.map((model) => (
                <option key={model.id} value={model.model}>
                  {model.model_display_name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="providerId">
              Provider
            </label>
            <select
              id="providerId"
              name="providerId"
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select a provider</option>
              {allProviders.map((provider) => (
                <option key={provider.id} value={provider.provider}>
                  {provider.provider_display_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Agent
        </button>
      </form>
    </div>
  );
}
