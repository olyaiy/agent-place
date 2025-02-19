'use client';

import Link from 'next/link';
import { Settings } from "lucide-react";
import type { Provider } from '../../db/schema/providers';

export function ProviderList({ items }: { items: Provider[] }) {
  return (
    <div className="flex flex-wrap gap-4">
      {items.map((provider) => (
        <div 
          key={provider.id}
          className="w-64 p-4 border rounded-lg hover:bg-gray-50 transition-colors relative group"
        >
          <h3 className="font-medium">{provider.provider_display_name}</h3>
          <p className="text-sm text-gray-500 truncate">{provider.provider}</p>
          
          <Link
            href={`/providers/${provider.provider}`}
            className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Settings className="w-4 h-4 text-gray-500 hover:text-gray-700" />
          </Link>
        </div>
      ))}
      
      <Link href="/providers/new" className="w-64">
        <div className="h-full p-4 border rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2">
          <div className="text-2xl font-bold">+</div>
          <p className="text-sm text-center">Create New Provider</p>
        </div>
      </Link>
    </div>
  );
} 