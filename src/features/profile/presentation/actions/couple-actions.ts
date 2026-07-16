"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/shared/lib/auth/get-current-user";
import { coupleRepository } from "@/features/profile/infrastructure/couple.repository";
import {
  createCoupleSchema,
  joinCoupleSchema,
} from "@/features/profile/application/couple-schemas";

export interface CoupleActionResult {
  error?: string;
}

export async function createCoupleAction(
  _prev: CoupleActionResult,
  formData: FormData,
): Promise<CoupleActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.coupleId) return { error: "Ya tenés un espacio de pareja." };

  const parsed = createCoupleSchema.safeParse({
    relationshipStartDate: formData.get("relationshipStartDate"),
    anniversaryDate: formData.get("anniversaryDate") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await coupleRepository.create(user.id, parsed.data);
  redirect("/dashboard");
}

export async function joinCoupleAction(
  _prev: CoupleActionResult,
  formData: FormData,
): Promise<CoupleActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.coupleId) return { error: "Ya tenés un espacio de pareja." };

  const parsed = joinCoupleSchema.safeParse({
    inviteCode: formData.get("inviteCode"),
  });

  if (!parsed.success) {
    return { error: "Código de invitación inválido" };
  }

  const result = await coupleRepository.joinByInviteCode(
    user.id,
    parsed.data.inviteCode,
  );

  if ("error" in result) {
    return {
      error:
        result.error === "full"
          ? "Ese espacio ya tiene dos personas."
          : "No encontramos una invitación con ese código.",
    };
  }

  redirect("/dashboard");
}
