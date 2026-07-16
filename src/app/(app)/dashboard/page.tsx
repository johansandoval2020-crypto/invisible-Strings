import type { Metadata } from "next";
import Link from "next/link";
import { HeartHandshake, ImagePlus, Mail, Shuffle } from "lucide-react";

import { PageContainer } from "@/shared/components/layout/page-container";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/layout/empty-state";
import { requireCoupleId } from "@/shared/lib/auth/get-current-user";
import { getDashboardData } from "@/features/dashboard/application/use-cases";

export const metadata: Metadata = { title: "Inicio" };

export default async function DashboardPage() {
  const coupleId = await requireCoupleId();
  const data = await getDashboardData(coupleId);

  const widgets = [
    {
      icon: HeartHandshake,
      title: "Días juntos",
      description:
        data.daysTogether !== null
          ? `${data.daysTogether.toLocaleString("es")} días y contando.`
          : "Configurá la fecha de inicio en Ajustes → Su espacio.",
    },
    {
      icon: ImagePlus,
      title: "Último recuerdo agregado",
      description: data.lastMemory
        ? data.lastMemory.title
        : "Todavía no han guardado ningún recuerdo.",
    },
    {
      icon: Mail,
      title: "Última carta",
      description: "Escriban su primera carta cuando quieran (Fase 3).",
    },
    {
      icon: Shuffle,
      title: "Recuerdo aleatorio",
      description: data.randomMemory
        ? data.randomMemory.title
        : "Aparecerá acá apenas tengan algunos recuerdos guardados.",
    },
  ];

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
        {widgets.map((widget) => (
          <Card key={widget.title}>
            <CardHeader>
              <widget.icon className="text-lavender-accent size-5" />
              <CardTitle className="mt-2 text-base">{widget.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {widget.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {data.totalMemories === 0 && (
        <EmptyState
          icon={ImagePlus}
          title="Todavía no hay recuerdos guardados"
          description="Cuando agreguen su primer recuerdo, va a aparecer acá y en la línea del tiempo."
          action={
            <Link
              href="/moments"
              className="text-lavender-accent text-sm font-medium underline underline-offset-4"
            >
              Ir a Nuestros Momentos
            </Link>
          }
        />
      )}
    </PageContainer>
  );
}
