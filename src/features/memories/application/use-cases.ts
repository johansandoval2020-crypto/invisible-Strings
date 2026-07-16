import "server-only";

import { memoryRepository } from "@/features/memories/infrastructure/memory.repository";
import { uploadMemoryImages } from "@/features/memories/infrastructure/storage.adapter";
import type {
  CreateMemoryInput,
  UpdateMemoryInput,
} from "@/features/memories/application/schemas";

/**
 * Casos de uso de "memories". Orquestan repositorio + storage — la única
 * lógica de negocio real acá es "crear un recuerdo también implica subir
 * sus imágenes y asociarlas", que no le compete a ninguna de las dos
 * capas de infraestructura por separado.
 */
export async function createMemory(
  coupleId: string,
  createdById: string,
  input: CreateMemoryInput,
  imageFiles: File[],
) {
  const memory = await memoryRepository.create(coupleId, createdById, input);

  if (imageFiles.length > 0) {
    const uploaded = await uploadMemoryImages(coupleId, memory.id, imageFiles);
    await memoryRepository.addImages(
      memory.id,
      uploaded.map((img, order) => ({ ...img, order })),
    );
  }

  return memory;
}

export async function updateMemory(coupleId: string, input: UpdateMemoryInput) {
  return memoryRepository.update(coupleId, input);
}

export async function listMemories(coupleId: string) {
  return memoryRepository.listByCouple(coupleId);
}

export async function listMemoriesByAlbum(coupleId: string, albumId: string) {
  return memoryRepository.listByAlbum(coupleId, albumId);
}

export async function listFavoriteMemories(coupleId: string) {
  return memoryRepository.listFavorites(coupleId);
}

export async function getMemory(coupleId: string, id: string) {
  return memoryRepository.findById(coupleId, id);
}

export async function toggleMemoryFavorite(coupleId: string, id: string) {
  return memoryRepository.toggleFavorite(coupleId, id);
}

export async function deleteMemory(coupleId: string, id: string) {
  return memoryRepository.softDelete(coupleId, id);
}
