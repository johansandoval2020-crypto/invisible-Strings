import "server-only";

import { prisma } from "@/shared/lib/prisma";
import type { CreateAlbumInput } from "@/features/albums/application/schemas";
import type { AlbumSummary } from "@/features/albums/domain/album.entity";

export const albumRepository = {
  async listByCouple(coupleId: string): Promise<AlbumSummary[]> {
    const albums = await prisma.album.findMany({
      where: { coupleId, deletedAt: null },
      orderBy: { order: "asc" },
      include: {
        _count: { select: { memories: { where: { deletedAt: null } } } },
        memories: {
          where: { deletedAt: null },
          orderBy: { date: "desc" },
          take: 1,
          include: { images: { where: { isCover: true }, take: 1 } },
        },
      },
    });

    return albums.map((album) => ({
      id: album.id,
      title: album.title,
      description: album.description,
      order: album.order,
      memoryCount: album._count.memories,
      coverImageUrl: album.coverImageUrl ?? album.memories[0]?.images[0]?.url ?? null,
    }));
  },

  async findById(coupleId: string, id: string) {
    return prisma.album.findFirst({ where: { id, coupleId, deletedAt: null } });
  },

  async create(coupleId: string, input: CreateAlbumInput) {
    const maxOrder = await prisma.album.aggregate({
      where: { coupleId },
      _max: { order: true },
    });

    return prisma.album.create({
      data: {
        coupleId,
        title: input.title,
        description: input.description || null,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });
  },

  async reorder(coupleId: string, orderedIds: string[]) {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.album.updateMany({
          where: { id, coupleId },
          data: { order: index },
        }),
      ),
    );
  },

  async softDelete(coupleId: string, id: string) {
    return prisma.album.updateMany({
      where: { id, coupleId },
      data: { deletedAt: new Date() },
    });
  },
};
