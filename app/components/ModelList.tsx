'use client';

import { useEffect, useState } from 'react';
import type { Model } from '../../db/schema/models';
import Link from 'next/link';
import { Settings } from "lucide-react";

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
          className="w-64 p-4 border rounded-lg hover:bg-gray-50 transition-colors relative group"
        >
          <h3 className="font-medium">{model.model_display_name}</h3>
          <p className="text-sm text-gray-500 truncate">{model.model}</p>
          
          <Link
            href={`/models/${model.model}`}
            className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Settings className="w-4 h-4 text-gray-500 hover:text-gray-700" />
          </Link>
        </div>
      ))}
      
      <Link href="/models/new" className="w-64">
        <div className="h-full p-4 border rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2">
          <div className="text-2xl font-bold">+</div>
          <p className="text-sm text-center">Create New Model</p>
        </div>
      </Link>
    </div>
  );
} 