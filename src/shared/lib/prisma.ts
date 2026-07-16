import { PrismaClient } from "@prisma/client";

/**
 * Cliente Prisma único por proceso. En desarrollo, Next.js recarga módulos
 * en caliente y sin este patrón cada recarga abriría una conexión nueva
 * a la base de datos hasta agotar el pool.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
