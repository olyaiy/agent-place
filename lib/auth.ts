import { db } from "@/db/connection";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    }),
    emailAndPassword: {
        enabled: true
    },
    schema: {
        user: schema.user,
        account: schema.account,
        session: schema.session,
        // verification: schema.verifications,
    },
    trustedOrigins: [
        "https://musical-happiness-p579qr47w66c96r6-3000.app.github.dev",
        "http://localhost:3000"
    ]
});