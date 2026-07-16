import { z } from "zod";

export const createCoupleSchema = z.object({
  relationshipStartDate: z
    .string()
    .min(1, "Elegí la fecha en la que empezaron su relación")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Fecha inválida"),
  anniversaryDate: z
    .string()
    .optional()
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Fecha inválida"),
});

export type CreateCoupleInput = z.infer<typeof createCoupleSchema>;

export const joinCoupleSchema = z.object({
  inviteCode: z.string().uuid("El código de invitación no es válido"),
});

export type JoinCoupleInput = z.infer<typeof joinCoupleSchema>;
