import type { Metadata } from "next";
import { FolderHeart } from "lucide-react";

import { PageContainer } from "@/shared/components/layout/page-container";
import { EmptyState } from "@/shared/components/layout/empty-state";
import { requireCoupleId } from "@/shared/lib/auth/get-current-user";
import { listAlbums } from "@/features/albums/application/use-cases";
import { AlbumGrid } from "@/features/albums/presentation/components/album-grid";
import { CreateAlbumDialog } from "@/features/albums/presentation/components/create-album-dialog";

export const metadata: Metadata = { title: "Álbumes" };

export default async function AlbumsPage() {
  const coupleId = await requireCoupleId();
  const albums = await listAlbums(coupleId);

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium">Álbumes</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Organicen sus recuerdos en colecciones — arrastrá para reordenar.
          </p>
        </div>
        <CreateAlbumDialog />
      </div>

      {albums.length === 0 ? (
        <EmptyState
          icon={FolderHeart}
          title="Todavía no tienen álbumes"
          description="Agrupen recuerdos por viaje, por año o como prefieran — se pueden reordenar arrastrando."
        />
      ) : (
        <AlbumGrid albums={albums} />
      )}
    </PageContainer>
  );
}
