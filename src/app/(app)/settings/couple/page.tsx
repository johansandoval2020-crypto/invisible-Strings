import type { Metadata } from "next";

import { PageContainer } from "@/shared/components/layout/page-container";

export const metadata: Metadata = { title: "Pareja" };

export default function CoupleSettingsPage() {
  return (
    <PageContainer>
      <h1 className="font-display text-2xl font-medium">Su espacio</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Fecha de inicio de relación, aniversario y tema visual.
      </p>
    </PageContainer>
  );
}
