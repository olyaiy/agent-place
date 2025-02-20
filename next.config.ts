import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "musical-happiness-p579qr47w66c96r6-3000.app.github.dev",
        "localhost:3000"
      ]
    }
  }
};

export default nextConfig;