import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // Load environment variables

export default defineConfig({
  schema: "./db/schema",  // Should point to your schema/index.ts
  out: "./db/migrations", // Verify this path exists
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Now properly loaded
  },
});
