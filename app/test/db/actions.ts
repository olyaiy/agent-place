'use server';

import { db } from "@/db/connection";
import { providers } from "@/db/schema/providers";

export async function addTestProvider() {
  return db.insert(providers).values({
    providerId: 'test-provider',
    providerName: 'Test Provider'
  }).returning();
} 