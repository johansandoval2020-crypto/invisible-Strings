import path from "node:path";
import { config as loadEnv } from "dotenv";
import { defineConfig, env } from "prisma/config";

/**
 * Prisma 7 movió la configuración de conexión (antes `url`/`directUrl` en
 * schema.prisma) a este archivo — ver AGENTS.md, es un cambio real de esta
 * versión y no algo específico de este proyecto.
 *
 * Este archivo lo usa la CLI de Prisma (`prisma migrate`, `prisma studio`,
 * etc.), NO la app en runtime — la app (`src/shared/lib/prisma.ts`) arma su
 * propia conexión vía `@prisma/adapter-pg`, que es el mecanismo requerido
 * para `new PrismaClient()` en esta versión.
 *
 * Next.js ya carga `.env.local` automáticamente, pero la CLI de Prisma se
 * ejecuta por fuera de Next, así que acá lo cargamos a mano.
 */
loadEnv({ path: path.resolve(__dirname, ".env.local") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
