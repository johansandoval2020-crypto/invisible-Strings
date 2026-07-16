import type { Metadata } from "next";
import { HeartHandshake, ImagePlus, Mail, Shuffle } from "lucide-react";

import { PageContainer } from "@/shared/components/layout/page-container";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/layout/empty-state";

export const metadata: Metadata = { title: "Inicio" };

const WIDGETS = [
  {
    icon: HeartHandshake,
    title: "Días juntos",
    description: "Se calcula en cuanto configures la fecha de inicio de su relación.",
  },
  {
    icon: ImagePlus,
    title: "Último recuerdo agregado",
    description: "Todavía no han guardado ningún recuerdo.",
  },
  {
    icon: Mail,
    title: "Última carta",
    description: "Escriban su primera carta cuando quieran.",
  },
  {
    icon: Shuffle,
    title: "Recuerdo aleatorio",
    description: "Aparecerá acá apenas tengan algunos recuerdos guardados.",
  },
];

export default function DashboardPage() {
  return (
    <PageContainer className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-foreground text-2xl font-medium">
          Hola de nuevo
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Este es el punto de partida de su historia juntos.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WIDGETS.map((widget) => (
          <Card key={widget.title}>
            <CardHeader>
              <widget.icon className="text-lavender-accent size-5" />
              <CardTitle className="mt-2 text-base">{widget.title}</CardTitle>
              <CardDescription>{widget.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <EmptyState
        icon={ImagePlus}
        title="Todavía no hay recuerdos guardados"
        description="Cuando agreguen su primer recuerdo, va a aparecer acá y en la línea del tiempo."
      />
    </PageContainer>
  );
}
