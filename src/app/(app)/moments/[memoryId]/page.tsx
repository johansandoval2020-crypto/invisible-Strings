import type { Metadata } from "next";

import { PageContainer } from "@/shared/components/layout/page-container";

export const metadata: Metadata = { title: "Recuerdo" };

/**
 * Vista de detalle completa, de página entera — se usa cuando se llega
 * por URL directa (compartida, recargada, o desde un buscador). Cuando
 * se llega navegando desde /moments, esta misma ruta se intercepta y se
 * muestra como modal (ver @modal/(.)[memoryId]/page.tsx).
 */
export default async function MemoryDetailPage({
  params,
}: {
  params: Promise<{ memoryId: string }>;
}) {
  const { memoryId } = await params;

  return (
    <PageContainer>
      <p className="text-muted-foreground text-sm">
        Vista inmersiva del recuerdo{" "}
        <span className="text-foreground font-mono">{memoryId}</span> — se implementa en
        la Fase 2 junto con el modo &ldquo;Revivir este momento&rdquo;.
      </p>
    </PageContainer>
  );
}
