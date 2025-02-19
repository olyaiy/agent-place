'use client';

import { useEffect, useState } from 'react';
import type { Model } from '../../db/schema/models';

export function ModelList({ items }: { items: Model[] }) {
  const [models, setModels] = useState(items);

  useEffect(() => {
    setModels(items);
  }, [items]);

  return (
    <div className="flex flex-wrap gap-4">
      {models.map((model) => (
        <div 
          key={model.id}
          className="w-64 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <h3 className="font-medium">{model.modelName}</h3>
          <p className="text-sm text-gray-500 truncate">{model.modelId}</p>
        </div>
      ))}
    </div>
  );
} 