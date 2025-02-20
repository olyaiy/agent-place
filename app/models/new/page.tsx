import { db } from "@/db/connection";
import { models } from "@/db/schema/models";
import { providers } from "@/db/schema/providers";
import { redirect } from "next/navigation";

export default async function NewModelPage() {
  const allProviders = await db.select().from(providers);

  async function createModel(formData: FormData) {
    "use server";
    
    await db.insert(models).values({
      model_display_name: formData.get("modelName") as string,
      model: formData.get("model") as string,
      provider: formData.get("providerId") as string || null,
    });

    redirect("/models");
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Model</h1>
      <form action={createModel} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="modelName">
            Model Name
          </label>
          <input
            id="modelName"
            name="modelName"
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="model">
            Model
          </label>
          <input
            id="model"
            name="model"
            required
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
          Create Model
        </button>
      </form>
    </div>
  );
} 