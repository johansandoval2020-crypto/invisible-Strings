import type { Metadata } from "next";

import { PageContainer } from "@/shared/components/layout/page-container";

export const metadata: Metadata = { title: "Carta" };

export default async function LetterDetailPage({
  params,
}: {
  params: Promise<{ letterId: string }>;
}) {
  const { letterId } = await params;

  return (
    <PageContainer>
      <p className="text-muted-foreground text-sm">
        Carta <span className="text-foreground font-mono">{letterId}</span> — se
        implementa en la Fase 3.
      </p>
    </PageContainer>
  );
}
