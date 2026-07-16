import type { Metadata } from "next";

import { PageContainer } from "@/shared/components/layout/page-container";

export const metadata: Metadata = { title: "Perfil" };

export default function ProfileSettingsPage() {
  return (
    <PageContainer>
      <h1 className="font-display text-2xl font-medium">Perfil</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Nombre, foto y preferencias personales.
      </p>
    </PageContainer>
  );
}
