import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las imágenes de recuerdos se sirven como URLs firmadas de Supabase
    // Storage — el hostname es *.supabase.co (o el dominio custom del
    // proyecto). Ver src/features/memories/infrastructure/storage.adapter.ts.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },
    ],
  },
};

export default nextConfig;
