import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageContainer } from "@/shared/components/layout/page-container";
import { requireCoupleId } from "@/shared/lib/auth/get-current-user";
import { getMemory } from "@/features/memories/application/use-cases";
import { MemoryDetail } from "@/features/memories/presentation/components/memory-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ memoryId: string }>;
}): Promise<Metadata> {
  const { memoryId } = await params;
  const coupleId = await requireCoupleId();
  const memory = await getMemory(coupleId, memoryId);
  return { title: memory?.title ?? "Recuerdo" };
}

/**
 * Vista de detalle completa, de página entera — se usa cuando se llega
 * por URL directa. Cuando se llega navegando desde /moments, esta misma
 * ruta se intercepta y se muestra como modal (ver @modal/(.)[memoryId]).
 */
export default async function MemoryDetailPage({
  params,
}: {
  params: Promise<{ memoryId: string }>;
}) {
  const { memoryId } = await params;
  const coupleId = await requireCoupleId();
  const memory = await getMemory(coupleId, memoryId);

  if (!memory) notFound();

  return (
    <PageContainer className="max-w-3xl">
      <MemoryDetail memory={memory} />
    </PageContainer>
  );
}
