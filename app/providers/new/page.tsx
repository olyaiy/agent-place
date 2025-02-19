import { db } from "@/db/connection";
import { providers } from "@/db/schema/providers";
import { redirect } from "next/navigation";

export default async function NewProviderPage() {
  async function createProvider(formData: FormData) {
    "use server";
    
    await db.insert(providers).values({
      provider_display_name: formData.get("displayName") as string,
      provider: formData.get("providerId") as string,
    });

    redirect("/providers");
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Provider</h1>
      <form action={createProvider} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="displayName">
            Display Name
          </label>
          <input
            id="displayName"
            name="displayName"
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="providerId">
            Provider ID
          </label>
          <input
            id="providerId"
            name="providerId"
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Provider
        </button>
      </form>
    </div>
  );
} 