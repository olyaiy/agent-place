import { db } from "@/db/connection";
import { providers } from "@/db/schema/providers";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function ProviderEditPage({
  params,
}: {
  params: { provider: string };
}) {
  const [provider] = await db
    .select()
    .from(providers)
    .where(eq(providers.provider, params.provider));

  if (!provider) {
    redirect("/providers");
  }

  async function updateProvider(formData: FormData) {
    "use server";

    await db
      .update(providers)
      .set({
        provider_display_name: formData.get("displayName") as string,
        provider: formData.get("provider") as string,
      })
      .where(eq(providers.id, provider.id));

    redirect(`/providers/${formData.get("provider")}`);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Provider</h1>
      <form action={updateProvider} className="space-y-4">
        <input type="hidden" name="id" value={provider.id} />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="displayName">
            Display Name
          </label>
          <input
            id="displayName"
            name="displayName"
            required
            defaultValue={provider.provider_display_name}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="provider">
            Provider
          </label>
          <input
            id="provider"
            name="provider"
            required
            defaultValue={provider.provider}
            className="w-full p-2 border rounded-md"
          />
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