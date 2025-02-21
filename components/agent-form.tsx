// agent-form.tsx
"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AgentFormProps {
  defaultValues?: {
    id?: string;
    name?: string;
    description?: string;
    systemPrompt?: string;
    modelId?: string;
    providerId?: string;
    visibility?: string;
  };
  models: Array<{ id: string; model: string; model_display_name: string }>;
  providers: Array<{ id: string; provider: string; provider_display_name: string }>;
  onSubmit: (formData: FormData) => Promise<void>;
  submitLabel: string;
  onDelete?: (formData: FormData) => Promise<void>;
}

export default function AgentForm({
  defaultValues = {},
  models,
  providers,
  onSubmit,
  submitLabel,
  onDelete,
}: AgentFormProps) {
  // Initialize with the passed visibility or default to "public"
  const [visibility, setVisibility] = useState(defaultValues.visibility || "public");

  return (
    <div className="relative max-w-4xl mx-auto p-6 border rounded-md">
      {/* Conditionally render delete button on top right if onDelete is provided */}
      {onDelete && defaultValues.id && (
        <form action={onDelete} className="absolute top-4 right-4">
          <input type="hidden" name="id" value={defaultValues.id} />
          <button
            type="submit"
            className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition-colors"
          >
            Delete Agent
          </button>
        </form>
      )}
      <form action={onSubmit} className="space-y-4">
        {defaultValues.id && (
          <input type="hidden" name="id" value={defaultValues.id} />
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="name">
            Agent Name
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={defaultValues.name}
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
            defaultValue={defaultValues.description}
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
            defaultValue={defaultValues.systemPrompt}
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
              defaultValue={defaultValues.modelId || ""}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select a model</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
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
              defaultValue={defaultValues.providerId || ""}
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
        </div>

        {/* Visibility select */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Visibility</label>
          <Select value={visibility} onValueChange={(val) => setVisibility(val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="link">Link</SelectItem>
            </SelectContent>
          </Select>
          {/* Hidden input to include the selected visibility in the form submission */}
          <input type="hidden" name="visibility" value={visibility} />
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
