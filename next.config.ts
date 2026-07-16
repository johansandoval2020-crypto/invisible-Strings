import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pg y los adapters de Prisma traen bindings/CJS que no conviene que
  // Next intente empaquetar para el server — los dejamos como dependencia
  // externa normal de Node (se resuelven vía node_modules en runtime).
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
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
