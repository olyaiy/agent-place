// app/models/ModelForm.tsx
interface ModelFormProps {
    defaultValues?: {
      id?: string;
      modelName?: string;
      model?: string;
      provider?: string;
    };
    providers: Array<{ id: string; provider_display_name: string }>;
    onSubmit: (formData: FormData) => Promise<void>;
    submitLabel: string;
  }
  
  export default function ModelForm({
    defaultValues = {},
    providers,
    onSubmit,
    submitLabel,
  }: ModelFormProps) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <form action={onSubmit} className="space-y-4">
          {/* Conditionally render hidden id field if provided */}
          {defaultValues.id && (
            <input type="hidden" name="id" value={defaultValues.id} />
          )}
  
          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="modelName">
              Model Name
            </label>
            <input
              id="modelName"
              name="modelName"
              required
              defaultValue={defaultValues.modelName}
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
              defaultValue={defaultValues.model}
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
              defaultValue={defaultValues.provider || ""}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select a provider</option>
              {providers.map((provider) => (
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
            {submitLabel}
          </button>
        </form>
      </div>
    );
  }
  