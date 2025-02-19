'use client';

import { useState } from 'react';
import type { Provider } from '../../db/schema/providers';

export function ProviderItem({ provider }: { provider: Provider }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="p-4 border rounded-lg mb-2">
      <button 
        className="font-medium hover:text-blue-600 transition-colors"
        onClick={() => setShowDetails(!showDetails)}
      >
        {provider.providerName}
      </button>
      {showDetails && (
        <div className="mt-2 text-sm text-gray-600">
          <p>ID: {provider.providerId}</p>
          <p>System ID: {provider.id}</p>
        </div>
      )}
    </div>
  );
} 