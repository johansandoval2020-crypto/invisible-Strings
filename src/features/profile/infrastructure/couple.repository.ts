import "server-only";

import { prisma } from "@/shared/lib/prisma";
import type { CreateCoupleInput } from "@/features/profile/application/couple-schemas";

/**
 * Acceso a datos de Couple. Es la única capa del feature "profile" que
 * puede importar el cliente de Prisma — ver docs/ARCHITECTURE.md §3.1.
 */
export const coupleRepository = {
  async findById(coupleId: string) {
    return prisma.couple.findUnique({ where: { id: coupleId } });
  },

  async findByInviteCode(inviteCode: string) {
    return prisma.couple.findUnique({ where: { inviteCode } });
  },

  async create(userId: string, input: CreateCoupleInput) {
    const couple = await prisma.couple.create({
      data: {
        relationshipStartDate: new Date(input.relationshipStartDate),
        anniversaryDate: input.anniversaryDate ? new Date(input.anniversaryDate) : null,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { coupleId: couple.id },
    });

    return couple;
  },

  async joinByInviteCode(userId: string, inviteCode: string) {
    const couple = await prisma.couple.findUnique({ where: { inviteCode } });
    if (!couple) return { error: "not_found" as const };

    const memberCount = await prisma.user.count({
      where: { coupleId: couple.id },
    });
    if (memberCount >= 2) return { error: "full" as const };

    await prisma.user.update({
      where: { id: userId },
      data: { coupleId: couple.id },
    });

    return { couple };
  },
};
