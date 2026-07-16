import type { Metadata } from "next";
import { Star } from "lucide-react";

import { PageContainer } from "@/shared/components/layout/page-container";
import { EmptyState } from "@/shared/components/layout/empty-state";
import { requireCoupleId } from "@/shared/lib/auth/get-current-user";
import { listFavoriteMemories } from "@/features/memories/application/use-cases";
import { MemoryGrid } from "@/features/memories/presentation/components/memory-grid";

export const metadata: Metadata = { title: "Favoritos" };

export default async function FavoritesPage() {
  const coupleId = await requireCoupleId();
  const memories = await listFavoriteMemories(coupleId);

  return (
    <PageContainer>
      <h1 className="font-display mb-1 text-2xl font-medium">Favoritos</h1>
      <p className="text-muted-foreground mb-6 text-sm">
        Recuerdos, álbumes, cartas y canciones que marcaron con estrella.
      </p>

      {memories.length === 0 ? (
        <EmptyState
          icon={Star}
          title="Nada marcado como favorito todavía"
          description="El corazón en cualquier recuerdo lo agrega acá."
        />
      ) : (
        <MemoryGrid memories={memories} />
      )}
    </PageContainer>
  );
}
