import "server-only";

import { prisma } from "@/shared/lib/prisma";
import type {
  CreateMemoryInput,
  UpdateMemoryInput,
} from "@/features/memories/application/schemas";
import type {
  MemoryDetail,
  MemorySummary,
} from "@/features/memories/domain/memory.entity";

const summarySelect = {
  id: true,
  title: true,
  description: true,
  date: true,
  mood: true,
  isFavorite: true,
  location: { select: { name: true } },
  images: {
    where: { isCover: true },
    take: 1,
    select: { url: true },
  },
} satisfies Parameters<typeof prisma.memory.findMany>[0]["select"];

function toSummary(
  m: Awaited<
    ReturnType<typeof prisma.memory.findFirst<{ select: typeof summarySelect }>>
  >,
): MemorySummary {
  return {
    id: m!.id,
    title: m!.title,
    description: m!.description,
    date: m!.date,
    mood: m!.mood,
    isFavorite: m!.isFavorite,
    coverImageUrl: m!.images[0]?.url ?? null,
    locationName: m!.location?.name ?? null,
  };
}

/**
 * find-or-create por nombre, scopeado a la pareja — usado para Location,
 * Tag y Person, que son reutilizables entre recuerdos (ver
 * docs/ARCHITECTURE.md §4.2: no son texto libre repetido, son entidades).
 */
async function findOrCreateLocation(coupleId: string, name: string) {
  return prisma.location.upsert({
    where: { coupleId_name: { coupleId, name } },
    update: {},
    create: { coupleId, name },
  });
}

async function findOrCreateTags(coupleId: string, names: string[]) {
  const tags = await Promise.all(
    names.map((name) =>
      prisma.tag.upsert({
        where: { coupleId_name: { coupleId, name } },
        update: {},
        create: { coupleId, name },
      }),
    ),
  );
  return tags;
}

async function findOrCreatePeople(coupleId: string, names: string[]) {
  const people = await Promise.all(
    names.map((name) =>
      prisma.person.upsert({
        where: { coupleId_name: { coupleId, name } },
        update: {},
        create: { coupleId, name },
      }),
    ),
  );
  return people;
}

export const memoryRepository = {
  async listByCouple(coupleId: string): Promise<MemorySummary[]> {
    const memories = await prisma.memory.findMany({
      where: { coupleId, deletedAt: null },
      orderBy: { date: "desc" },
      select: summarySelect,
    });
    return memories.map((m) => toSummary(m));
  },

  async listByAlbum(coupleId: string, albumId: string): Promise<MemorySummary[]> {
    const memories = await prisma.memory.findMany({
      where: { coupleId, albumId, deletedAt: null },
      orderBy: { date: "desc" },
      select: summarySelect,
    });
    return memories.map((m) => toSummary(m));
  },

  async listFavorites(coupleId: string): Promise<MemorySummary[]> {
    const memories = await prisma.memory.findMany({
      where: { coupleId, isFavorite: true, deletedAt: null },
      orderBy: { date: "desc" },
      select: summarySelect,
    });
    return memories.map((m) => toSummary(m));
  },

  async findById(coupleId: string, id: string): Promise<MemoryDetail | null> {
    const memory = await prisma.memory.findFirst({
      where: { id, coupleId, deletedAt: null },
      include: {
        location: { select: { name: true } },
        images: { orderBy: { order: "asc" } },
        tags: { include: { tag: true } },
        people: { include: { person: true } },
      },
    });
    if (!memory) return null;

    return {
      id: memory.id,
      title: memory.title,
      description: memory.description,
      date: memory.date,
      mood: memory.mood,
      isFavorite: memory.isFavorite,
      isHidden: memory.isHidden,
      albumId: memory.albumId,
      weather: memory.weather,
      coverImageUrl:
        memory.images.find((img) => img.isCover)?.url ?? memory.images[0]?.url ?? null,
      locationName: memory.location?.name ?? null,
      images: memory.images.map((img) => ({
        id: img.id,
        url: img.url,
        width: img.width,
        height: img.height,
        order: img.order,
        isCover: img.isCover,
        blurhash: img.blurhash,
      })),
      tags: memory.tags.map(({ tag }) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
      })),
      people: memory.people.map(({ person }) => ({ id: person.id, name: person.name })),
      createdAt: memory.createdAt,
    };
  },

  async create(coupleId: string, createdById: string, input: CreateMemoryInput) {
    const [location, tags, people] = await Promise.all([
      input.locationName ? findOrCreateLocation(coupleId, input.locationName) : null,
      findOrCreateTags(coupleId, input.tagNames),
      findOrCreatePeople(coupleId, input.peopleNames),
    ]);

    return prisma.memory.create({
      data: {
        coupleId,
        createdById,
        title: input.title,
        description: input.description || null,
        date: new Date(input.date),
        weather: input.weather || null,
        mood: input.mood,
        locationId: location?.id,
        albumId: input.albumId || null,
        tags: { create: tags.map((tag) => ({ tagId: tag.id })) },
        people: { create: people.map((person) => ({ personId: person.id })) },
      },
    });
  },

  async update(coupleId: string, input: UpdateMemoryInput) {
    const { id, tagNames, peopleNames, locationName, ...rest } = input;

    const [location, tags, people] = await Promise.all([
      locationName ? findOrCreateLocation(coupleId, locationName) : undefined,
      tagNames ? findOrCreateTags(coupleId, tagNames) : undefined,
      peopleNames ? findOrCreatePeople(coupleId, peopleNames) : undefined,
    ]);

    return prisma.memory.update({
      where: { id, coupleId },
      data: {
        ...(rest.title !== undefined && { title: rest.title }),
        ...(rest.description !== undefined && {
          description: rest.description || null,
        }),
        ...(rest.date !== undefined && { date: new Date(rest.date) }),
        ...(rest.weather !== undefined && { weather: rest.weather || null }),
        ...(rest.mood !== undefined && { mood: rest.mood }),
        ...(rest.albumId !== undefined && { albumId: rest.albumId || null }),
        ...(location !== undefined && { locationId: location?.id ?? null }),
        ...(tags !== undefined && {
          tags: {
            deleteMany: {},
            create: tags.map((tag) => ({ tagId: tag.id })),
          },
        }),
        ...(people !== undefined && {
          people: {
            deleteMany: {},
            create: people.map((person) => ({ personId: person.id })),
          },
        }),
      },
    });
  },

  async addImages(
    memoryId: string,
    images: { url: string; width: number; height: number; order: number }[],
  ) {
    await prisma.memoryImage.createMany({
      data: images.map((img, i) => ({
        memoryId,
        url: img.url,
        width: img.width,
        height: img.height,
        order: img.order,
        isCover: i === 0,
      })),
    });
  },

  async toggleFavorite(coupleId: string, id: string) {
    const memory = await prisma.memory.findFirst({
      where: { id, coupleId },
      select: { isFavorite: true },
    });
    if (!memory) return null;

    return prisma.memory.update({
      where: { id },
      data: { isFavorite: !memory.isFavorite },
    });
  },

  async softDelete(coupleId: string, id: string) {
    return prisma.memory.updateMany({
      where: { id, coupleId },
      data: { deletedAt: new Date() },
    });
  },
};
