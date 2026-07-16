import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Images } from "lucide-react";

import { PageContainer } from "@/shared/components/layout/page-container";
import { EmptyState } from "@/shared/components/layout/empty-state";
import { requireCoupleId } from "@/shared/lib/auth/get-current-user";
import { getAlbum } from "@/features/albums/application/use-cases";
import { listMemoriesByAlbum } from "@/features/memories/application/use-cases";
import { MemoryGrid } from "@/features/memories/presentation/components/memory-grid";
import { CreateMemoryDialog } from "@/features/memories/presentation/components/create-memory-dialog";
import { Button } from "@/shared/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ albumId: string }>;
}): Promise<Metadata> {
  const { albumId } = await params;
  const coupleId = await requireCoupleId();
  const album = await getAlbum(coupleId, albumId);
  return { title: album?.title ?? "Álbum" };
}

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ albumId: string }>;
}) {
  const { albumId } = await params;
  const coupleId = await requireCoupleId();
  const album = await getAlbum(coupleId, albumId);
  if (!album) notFound();

  const memories = await listMemoriesByAlbum(coupleId, albumId);

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium">{album.title}</h1>
          {album.description && (
            <p className="text-muted-foreground mt-1 text-sm">{album.description}</p>
          )}
        </div>
        <CreateMemoryDialog
          defaultAlbumId={album.id}
          trigger={<Button>Agregar recuerdo</Button>}
        />
      </div>

      {memories.length === 0 ? (
        <EmptyState
          icon={Images}
          title="Este álbum todavía está vacío"
          description="Agregá el primer recuerdo de esta colección."
        />
      ) : (
        <MemoryGrid memories={memories} />
      )}
    </PageContainer>
  );
}
