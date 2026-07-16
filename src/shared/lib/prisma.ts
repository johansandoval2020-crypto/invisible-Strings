import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * Cliente Prisma único por proceso. En desarrollo, Next.js recarga módulos
 * en caliente y sin este patrón cada recarga abriría una conexión nueva
 * a la base de datos hasta agotar el pool.
 *
 * Prisma 7 requiere pasar un "driver adapter" explícito al constructor
 * (`new PrismaClient()` sin argumentos ya no es válido) — ver AGENTS.md,
 * es un cambio real de esta versión. Usamos el pooler de Supabase
 * (DATABASE_URL) acá porque esta es la conexión de runtime de la app;
 * `prisma.config.ts` usa la conexión directa (DIRECT_URL) para las
 * migraciones, que es un proceso separado.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
