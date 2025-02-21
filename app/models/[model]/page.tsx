// app/models/[model]/page.tsx
import { db } from "@/db/connection";
import { models } from "@/db/schema/models";
import { providers } from "@/db/schema/providers";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import ModelForm from "@/components/model-form";

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
    <>
      <h1 className="text-2xl font-bold mb-6">Edit Model</h1>
      <ModelForm
        defaultValues={{
          id: model.id,
          modelName: model.model_display_name,
          model: model.model,
          provider: model.provider || "",
        }}
        providers={allProviders}
        onSubmit={updateModel}
        submitLabel="Save Changes"
      />
    </>
  );
}
