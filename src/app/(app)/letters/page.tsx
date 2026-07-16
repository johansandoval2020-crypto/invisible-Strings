import type { Metadata } from "next";
import { Mail } from "lucide-react";

import { PageContainer } from "@/shared/components/layout/page-container";
import { EmptyState } from "@/shared/components/layout/empty-state";
import { Button } from "@/shared/components/ui/button";

export const metadata: Metadata = { title: "Cartas" };

export default function LettersPage() {
  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium">Cartas</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Un espacio privado para escribirse.
          </p>
        </div>
        <Button>Escribir carta</Button>
      </div>
      <EmptyState
        icon={Mail}
        title="Todavía no se han escrito ninguna carta"
        description="Pueden programar la fecha en la que se abre, o dejarla lista para leer de inmediato."
      />
    </PageContainer>
  );
}
