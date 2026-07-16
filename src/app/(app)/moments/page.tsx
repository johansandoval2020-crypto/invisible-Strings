import type { Metadata } from "next";
import { Images } from "lucide-react";

import { PageContainer } from "@/shared/components/layout/page-container";
import { EmptyState } from "@/shared/components/layout/empty-state";
import { Button } from "@/shared/components/ui/button";

export const metadata: Metadata = { title: "Nuestros Momentos" };

/**
 * Fase 0: shell de la página. El grid + los carruseles horizontales
 * estilo Netflix (Recuerdos recientes, Nuestros viajes, Primeras veces…)
 * se implementan en la Fase 2 sobre el CRUD de la Fase 1.
 */
export default function MomentsPage() {
  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium">Nuestros Momentos</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Cada recuerdo, con su historia completa.
          </p>
        </div>
        <Button>Agregar recuerdo</Button>
      </div>

      <EmptyState
        icon={Images}
        title="Su primer recuerdo empieza acá"
        description="Título, fecha, lugar, fotos, personas, emociones y la canción del momento — todo en un mismo lugar."
      />
    </PageContainer>
  );
}
