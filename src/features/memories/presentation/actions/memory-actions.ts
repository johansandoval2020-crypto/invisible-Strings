"use server";

import { revalidatePath } from "next/cache";

import { requireCoupleId, getCurrentUser } from "@/shared/lib/auth/get-current-user";
import { createMemorySchema } from "@/features/memories/application/schemas";
import {
  createMemory,
  deleteMemory,
  toggleMemoryFavorite,
} from "@/features/memories/application/use-cases";

export interface MemoryActionResult {
  error?: string;
  success?: boolean;
}

export async function createMemoryAction(
  _prev: MemoryActionResult,
  formData: FormData,
): Promise<MemoryActionResult> {
  const coupleId = await requireCoupleId();
  const user = await getCurrentUser();
  if (!user) return { error: "Sesión inválida" };

  const parsed = createMemorySchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    date: formData.get("date"),
    locationName: formData.get("locationName") ?? "",
    weather: formData.get("weather") ?? "",
    mood: formData.getAll("mood"),
    tagNames:
      (formData.get("tagNames") as string | null)
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean) ?? [],
    peopleNames:
      (formData.get("peopleNames") as string | null)
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean) ?? [],
    albumId: formData.get("albumId") ?? "",
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Revisá los datos del formulario",
    };
  }

  const imageFiles = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);

  try {
    await createMemory(coupleId, user.id, parsed.data, imageFiles);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "No pudimos guardar el recuerdo",
    };
  }

  revalidatePath("/moments");
  revalidatePath("/dashboard");
  revalidatePath("/timeline");
  return { success: true };
}

export async function toggleFavoriteAction(memoryId: string) {
  const coupleId = await requireCoupleId();
  await toggleMemoryFavorite(coupleId, memoryId);
  revalidatePath("/moments");
  revalidatePath("/favorites");
}

export async function deleteMemoryAction(memoryId: string) {
  const coupleId = await requireCoupleId();
  await deleteMemory(coupleId, memoryId);
  revalidatePath("/moments");
  revalidatePath("/dashboard");
}
