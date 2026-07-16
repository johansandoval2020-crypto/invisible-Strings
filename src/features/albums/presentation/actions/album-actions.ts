"use server";

import { revalidatePath } from "next/cache";

import { requireCoupleId } from "@/shared/lib/auth/get-current-user";
import {
  createAlbumSchema,
  reorderAlbumsSchema,
} from "@/features/albums/application/schemas";
import {
  createAlbum,
  deleteAlbum,
  reorderAlbums,
} from "@/features/albums/application/use-cases";

export interface AlbumActionResult {
  error?: string;
  success?: boolean;
}

export async function createAlbumAction(
  _prev: AlbumActionResult,
  formData: FormData,
): Promise<AlbumActionResult> {
  const coupleId = await requireCoupleId();

  const parsed = createAlbumSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await createAlbum(coupleId, parsed.data);
  revalidatePath("/albums");
  return { success: true };
}

export async function reorderAlbumsAction(orderedIds: string[]) {
  const coupleId = await requireCoupleId();
  const parsed = reorderAlbumsSchema.safeParse({ orderedIds });
  if (!parsed.success) return;

  await reorderAlbums(coupleId, parsed.data.orderedIds);
  revalidatePath("/albums");
}

export async function deleteAlbumAction(albumId: string) {
  const coupleId = await requireCoupleId();
  await deleteAlbum(coupleId, albumId);
  revalidatePath("/albums");
}
