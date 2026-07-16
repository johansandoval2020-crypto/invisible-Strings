import type { Metadata } from "next";
import { Search } from "lucide-react";

import { PageContainer } from "@/shared/components/layout/page-container";
import { EmptyState } from "@/shared/components/layout/empty-state";

export const metadata: Metadata = { title: "Buscar" };

export default function SearchPage() {
  return (
    <PageContainer>
      <h1 className="font-display mb-6 text-2xl font-medium">Buscar</h1>
      <EmptyState
        icon={Search}
        title="Busca por fecha, álbum, lugar, etiqueta, texto o emoción"
        description="También podés abrir el buscador desde cualquier pantalla con ⌘K / Ctrl+K."
      />
    </PageContainer>
  );
}
