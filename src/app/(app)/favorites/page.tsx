import type { Metadata } from "next";
import { Star } from "lucide-react";

import { PageContainer } from "@/shared/components/layout/page-container";
import { EmptyState } from "@/shared/components/layout/empty-state";

export const metadata: Metadata = { title: "Favoritos" };

export default function FavoritesPage() {
  return (
    <PageContainer>
      <h1 className="font-display mb-1 text-2xl font-medium">Favoritos</h1>
      <p className="text-muted-foreground mb-6 text-sm">
        Recuerdos, álbumes, cartas y canciones que marcaron con estrella.
      </p>
      <EmptyState
        icon={Star}
        title="Nada marcado como favorito todavía"
        description="El corazón o la estrella en cualquier tarjeta lo agrega acá."
      />
    </PageContainer>
  );
}
