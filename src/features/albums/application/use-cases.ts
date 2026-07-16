import "server-only";

import { albumRepository } from "@/features/albums/infrastructure/album.repository";
import type { CreateAlbumInput } from "@/features/albums/application/schemas";

export async function listAlbums(coupleId: string) {
  return albumRepository.listByCouple(coupleId);
}

export async function getAlbum(coupleId: string, id: string) {
  return albumRepository.findById(coupleId, id);
}

export async function createAlbum(coupleId: string, input: CreateAlbumInput) {
  return albumRepository.create(coupleId, input);
}

export async function reorderAlbums(coupleId: string, orderedIds: string[]) {
  return albumRepository.reorder(coupleId, orderedIds);
}

export async function deleteAlbum(coupleId: string, id: string) {
  return albumRepository.softDelete(coupleId, id);
}
