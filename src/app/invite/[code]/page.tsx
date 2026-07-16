import type { Metadata } from "next";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";

export const metadata: Metadata = { title: "Invitación" };

/**
 * Flujo de emparejamiento de pareja (ver docs/ARCHITECTURE.md §2.2).
 * La resolución real del código de invitación contra Couple.inviteCode
 * se conecta en la Fase 0 en cuanto haya credenciales de Supabase — acá
 * queda el esqueleto de la página.
 */
export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Les invitaron a un espacio</CardTitle>
          <CardDescription>
            Código <span className="text-foreground font-mono">{code}</span> — confirmá
            para unirte a la pareja que te invitó.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
