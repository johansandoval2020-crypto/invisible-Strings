import type { Metadata } from "next";

import { PageContainer } from "@/shared/components/layout/page-container";

export const metadata: Metadata = { title: "Notificaciones" };

export default function NotificationsSettingsPage() {
  return (
    <PageContainer>
      <h1 className="font-display text-2xl font-medium">Notificaciones</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Avisos de cartas programadas, aniversarios y cumpleaños. Se implementa en la
        Fase 3.
      </p>
    </PageContainer>
  );
}
