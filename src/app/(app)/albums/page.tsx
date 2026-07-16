import type { Metadata } from "next";
import { FolderHeart } from "lucide-react";

import { PageContainer } from "@/shared/components/layout/page-container";
import { EmptyState } from "@/shared/components/layout/empty-state";
import { Button } from "@/shared/components/ui/button";

export const metadata: Metadata = { title: "Álbumes" };

export default function AlbumsPage() {
  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium">Álbumes</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Organicen sus recuerdos en colecciones.
          </p>
        </div>
        <Button>Crear álbum</Button>
      </div>
      <EmptyState
        icon={FolderHeart}
        title="Todavía no tienen álbumes"
        description="Agrupen recuerdos por viaje, por año o como prefieran — se pueden reordenar arrastrando."
      />
    </PageContainer>
  );
}
