import type { Metadata } from "next";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { getCurrentUser } from "@/shared/lib/auth/get-current-user";
import { coupleRepository } from "@/features/profile/infrastructure/couple.repository";
import { JoinCoupleForm } from "@/features/profile/presentation/components/join-couple-form";

export const metadata: Metadata = { title: "Invitación" };

export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const [user, couple] = await Promise.all([
    getCurrentUser(),
    coupleRepository.findByInviteCode(code),
  ]);

  if (!couple) {
    return (
      <InviteShell title="Esta invitación ya no es válida">
        <p className="text-muted-foreground text-sm">
          El código puede estar vencido o mal copiado. Pedile a tu pareja que te
          comparta el enlace de nuevo desde su espacio.
        </p>
      </InviteShell>
    );
  }

  if (!user) {
    return (
      <InviteShell title="Les invitaron a un espacio">
        <p className="text-muted-foreground mb-4 text-sm">
          Creá tu cuenta o entrá con la que ya tenés para unirte.
        </p>
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/signup?redirect=/invite/${code}`}>Crear cuenta</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/login?redirect=/invite/${code}`}>Entrar</Link>
          </Button>
        </div>
      </InviteShell>
    );
  }

  if (user.coupleId === couple.id) {
    return (
      <InviteShell title="Ya forman parte de este espacio">
        <Button asChild>
          <Link href="/dashboard">Ir al inicio</Link>
        </Button>
      </InviteShell>
    );
  }

  if (user.coupleId) {
    return (
      <InviteShell title="Ya tenés un espacio">
        <p className="text-muted-foreground text-sm">
          Tu cuenta ya está emparejada con otra pareja — no podés unirte a esta también.
        </p>
      </InviteShell>
    );
  }

  return (
    <InviteShell title="Les invitaron a un espacio">
      <p className="text-muted-foreground mb-4 text-sm">
        Confirmá para unirte al espacio de tu pareja.
      </p>
      <JoinCoupleForm inviteCode={code} />
    </InviteShell>
  );
}

function InviteShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="sr-only">Invitación</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
