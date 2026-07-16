import "server-only";
import { differenceInCalendarDays } from "date-fns";

import { listMemories } from "@/features/memories/application/use-cases";
// Lectura directa del repositorio de "profile" — Couple no tiene su propio
// feature dedicado (ver docs/ARCHITECTURE.md §8), así que el dashboard lo
// lee de ahí en vez de duplicar la consulta. Es una excepción puntual y
// de solo lectura a la regla de "un feature no importa infrastructure de
// otro"; si Couple crece, merece su propio feature.
import { coupleRepository } from "@/features/profile/infrastructure/couple.repository";

export interface DashboardData {
  daysTogether: number | null;
  totalMemories: number;
  lastMemory: Awaited<ReturnType<typeof listMemories>>[number] | null;
  randomMemory: Awaited<ReturnType<typeof listMemories>>[number] | null;
  anniversaryDate: Date | null;
}

export async function getDashboardData(coupleId: string): Promise<DashboardData> {
  const [couple, memories] = await Promise.all([
    coupleRepository.findById(coupleId),
    listMemories(coupleId),
  ]);

  const daysTogether = couple
    ? differenceInCalendarDays(new Date(), couple.relationshipStartDate)
    : null;

  return {
    daysTogether,
    totalMemories: memories.length,
    lastMemory: memories[0] ?? null,
    randomMemory:
      memories.length > 0
        ? memories[Math.floor(Math.random() * memories.length)]
        : null,
    anniversaryDate: couple?.anniversaryDate ?? null,
  };
}
