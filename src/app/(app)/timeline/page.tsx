import type { Metadata } from "next";
import { History } from "lucide-react";

import { PageContainer } from "@/shared/components/layout/page-container";
import { EmptyState } from "@/shared/components/layout/empty-state";

export const metadata: Metadata = { title: "Línea del tiempo" };

export default function TimelinePage() {
  return (
    <PageContainer>
      <h1 className="font-display mb-1 text-2xl font-medium">Línea del tiempo</h1>
      <p className="text-muted-foreground mb-6 text-sm">
        Su historia, organizada por año, mes y evento.
      </p>
      <EmptyState
        icon={History}
        title="La línea del tiempo se arma sola"
        description="En cuanto agreguen recuerdos con fecha, van a aparecer acá ordenados automáticamente."
      />
    </PageContainer>
  );
}
