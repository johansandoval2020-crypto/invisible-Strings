import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageContainer } from "@/shared/components/layout/page-container";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import { getCurrentUser } from "@/shared/lib/auth/get-current-user";
import { coupleRepository } from "@/features/profile/infrastructure/couple.repository";
import { CreateCoupleForm } from "@/features/profile/presentation/components/create-couple-form";
import { JoinCoupleForm } from "@/features/profile/presentation/components/join-couple-form";
import { InviteLinkCard } from "@/features/profile/presentation/components/invite-link-card";

export const metadata: Metadata = { title: "Su espacio" };

export default async function CoupleSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (!user.coupleId) {
    return (
      <PageContainer className="flex justify-center">
        <div className="w-full max-w-md">
          <h1 className="font-display mb-1 text-2xl font-medium">
            Empecemos su espacio
          </h1>
          <p className="text-muted-foreground mb-6 text-sm">
            Podés crear un espacio nuevo, o unirte al que ya creó tu pareja con un
            código de invitación.
          </p>
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Crear espacio</CardTitle>
                <CardDescription>
                  Vos empezás — después invitás a tu pareja.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateCoupleForm />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Unirme a un espacio</CardTitle>
                <CardDescription>
                  Tu pareja ya te compartió un código o un enlace.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <JoinCoupleForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    );
  }

  const couple = await coupleRepository.findById(user.coupleId);
  if (!couple) redirect("/settings/couple");

  return (
    <PageContainer>
      <h1 className="font-display mb-1 text-2xl font-medium">Su espacio</h1>
      <p className="text-muted-foreground mb-6 text-sm">
        Empezaron su relación el{" "}
        {couple.relationshipStartDate.toLocaleDateString("es", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        .
      </p>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-base">Invitá a tu pareja</CardTitle>
          <CardDescription>
            Compartile este enlace para que se una a su espacio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InviteLinkCard inviteCode={couple.inviteCode} />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
