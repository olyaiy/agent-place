import { db } from "@/db/connection";
import { models } from "@/db/schema/models";
import { providers } from "@/db/schema/providers";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";


export default async function ModelEditPage({
  params,
}: {
  params: Promise<{ model: string }>;
}) {
  const resolvedParams = await params;

  const [model] = await db
    .select()
    .from(models)
    .where(eq(models.model, resolvedParams.model));

  if (!model) {
    redirect("/models");
  }

  const allProviders = await db.select().from(providers);

  async function updateModel(formData: FormData) {
    "use server";

    await db
      .update(models)
      .set({
        model_display_name: formData.get("modelName") as string,
        model: formData.get("model") as string,
        provider: formData.get("providerId") as string || null,
      })
      .where(eq(models.id, model.id));

    redirect(`/models/${formData.get("model")}`);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Model</h1>
      <form action={updateModel} className="space-y-4">
        <input type="hidden" name="id" value={model.id} />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="modelName">
            Model Name
          </label>
          <input
            id="modelName"
            name="modelName"
            required
            defaultValue={model.model_display_name}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="model">
            Model ID
          </label>
          <input
            id="model"
            name="model"
            required
            defaultValue={model.model}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="providerId">
            Provider
          </label>
          <select
            id="providerId"
            name="providerId"
            defaultValue={model.provider || ""}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select a provider</option>
            {allProviders.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.provider_display_name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
} 