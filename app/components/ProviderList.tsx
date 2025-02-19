'use client';

import { useEffect, useState } from 'react';
import type { providers } from '../../db/schema/providers';

type Provider = typeof providers.$inferSelect;

export function ProviderList({ items }: { items: Provider[] }) {
  const [providers, setProviders] = useState(items);

  useEffect(() => {
    setProviders(items);
  }, [items]);

  return (
    <div className="flex flex-wrap gap-4">
      {providers.map((provider) => (
        <div 
          key={provider.id}
          className="w-64 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <h3 className="font-medium">{provider.providerName}</h3>
          <p className="text-sm text-gray-500 truncate">{provider.providerId}</p>
        </div>
      ))}
    </div>
  );
} 