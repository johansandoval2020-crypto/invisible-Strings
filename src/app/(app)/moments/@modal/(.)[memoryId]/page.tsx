import { notFound } from "next/navigation";

import { requireCoupleId } from "@/shared/lib/auth/get-current-user";
import { getMemory } from "@/features/memories/application/use-cases";
import { MemoryModal } from "@/features/memories/presentation/components/memory-modal";

export default async function InterceptedMemoryModal({
  params,
}: {
  params: Promise<{ memoryId: string }>;
}) {
  const { memoryId } = await params;
  const coupleId = await requireCoupleId();
  const memory = await getMemory(coupleId, memoryId);

  if (!memory) notFound();

  return <MemoryModal memory={memory} />;
}
