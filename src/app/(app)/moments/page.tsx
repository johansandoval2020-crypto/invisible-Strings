import type { Metadata } from "next";
import { Images } from "lucide-react";

import { PageContainer } from "@/shared/components/layout/page-container";
import { EmptyState } from "@/shared/components/layout/empty-state";
import { requireCoupleId } from "@/shared/lib/auth/get-current-user";
import { listMemories } from "@/features/memories/application/use-cases";
import { MemoryGrid } from "@/features/memories/presentation/components/memory-grid";
import { CreateMemoryDialog } from "@/features/memories/presentation/components/create-memory-dialog";

export const metadata: Metadata = { title: "Nuestros Momentos" };

export default async function MomentsPage() {
  const coupleId = await requireCoupleId();
  const memories = await listMemories(coupleId);

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium">Nuestros Momentos</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Cada recuerdo, con su historia completa.
          </p>
        </div>
        <CreateMemoryDialog />
      </div>

      {memories.length === 0 ? (
        <EmptyState
          icon={Images}
          title="Su primer recuerdo empieza acá"
          description="Título, fecha, lugar, fotos, personas, emociones y la canción del momento — todo en un mismo lugar."
        />
      ) : (
        <MemoryGrid memories={memories} />
      )}
    </PageContainer>
  );
}
