import type { Metadata } from "next";

import { PageContainer } from "@/shared/components/layout/page-container";

export const metadata: Metadata = { title: "Nueva carta" };

export default function NewLetterPage() {
  return (
    <PageContainer>
      <h1 className="font-display mb-1 text-2xl font-medium">Nueva carta</h1>
      <p className="text-muted-foreground text-sm">
        El editor enriquecido con Markdown y la programación de fecha de apertura se
        implementan en la Fase 3.
      </p>
    </PageContainer>
  );
}
