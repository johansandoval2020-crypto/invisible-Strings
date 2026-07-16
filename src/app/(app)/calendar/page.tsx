import type { Metadata } from "next";
import { CalendarHeart } from "lucide-react";

import { PageContainer } from "@/shared/components/layout/page-container";
import { EmptyState } from "@/shared/components/layout/empty-state";

export const metadata: Metadata = { title: "Calendario" };

export default function CalendarPage() {
  return (
    <PageContainer>
      <h1 className="font-display mb-1 text-2xl font-medium">Calendario</h1>
      <p className="text-muted-foreground mb-6 text-sm">
        Cumpleaños, aniversarios, viajes y cuentas regresivas.
      </p>
      <EmptyState
        icon={CalendarHeart}
        title="Agreguen su primera fecha importante"
        description="El calendario y las cuentas regresivas se implementan en la Fase 4."
      />
    </PageContainer>
  );
}
