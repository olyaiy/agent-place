import { db } from "@/db/connection";
import { providers } from "@/db/schema";

export default async function DBTestPage() {
  try {
    // Test database connection
    const testResult = await db.select().from(providers).limit(1);
    
    return (
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Database Connection Test</h1>
        <div className="p-4 bg-green-100 rounded-lg">
          <p className="text-green-700">✅ Database connection successful!</p>
          <pre className="mt-2 text-sm">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4 bg-red-100 rounded-lg">
        <p className="text-red-700">❌ Database connection failed:</p>
        <pre className="mt-2 text-sm text-red-600">
          {error instanceof Error ? error.message : 'Unknown error'}
        </pre>
      </div>
    );
  }
} 