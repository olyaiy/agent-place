// app/models/new/page.tsx
import ModelForm from "@/components/model-form";
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
    <>
      <h1 className="text-2xl font-bold mb-6">Create New Model</h1>
      <ModelForm
        providers={allProviders}
        onSubmit={createModel}
        submitLabel="Create Model"
      />
    </>
  );
}
