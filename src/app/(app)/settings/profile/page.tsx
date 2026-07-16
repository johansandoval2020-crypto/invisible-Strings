import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageContainer } from "@/shared/components/layout/page-container";
import { Button } from "@/shared/components/ui/button";
import { getCurrentUser } from "@/shared/lib/auth/get-current-user";
import { signOutAction } from "@/features/auth/presentation/actions/auth-actions";

export const metadata: Metadata = { title: "Perfil" };

export default async function ProfileSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <PageContainer className="max-w-md">
      <h1 className="font-display text-2xl font-medium">Perfil</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Nombre, foto y preferencias personales.
      </p>

      <div className="border-border bg-card mt-6 flex flex-col gap-3 rounded-2xl border p-5">
        <div>
          <p className="text-muted-foreground text-xs">Nombre</p>
          <p className="text-foreground text-sm">{user.displayName}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Correo</p>
          <p className="text-foreground text-sm">{user.email}</p>
        </div>
      </div>

      <form action={signOutAction} className="mt-6">
        <Button type="submit" variant="outline">
          Cerrar sesión
        </Button>
      </form>
    </PageContainer>
  );
}
