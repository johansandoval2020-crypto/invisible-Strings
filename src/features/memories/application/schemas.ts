import { z } from "zod";

const EMOTION_VALUES = [
  "HAPPY",
  "EXCITED",
  "GRATEFUL",
  "NOSTALGIC",
  "PEACEFUL",
  "ROMANTIC",
  "SAD",
  "BITTERSWEET",
  "PROUD",
  "FUNNY",
] as const;

export const createMemorySchema = z.object({
  title: z.string().trim().min(1, "Ponele un título a este recuerdo").max(120),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  date: z
    .string()
    .min(1, "Elegí una fecha")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Fecha inválida"),
  locationName: z.string().trim().max(120).optional().or(z.literal("")),
  weather: z.string().trim().max(60).optional().or(z.literal("")),
  mood: z.array(z.enum(EMOTION_VALUES)).max(5).default([]),
  tagNames: z.array(z.string().trim().min(1).max(40)).max(10).default([]),
  peopleNames: z.array(z.string().trim().min(1).max(60)).max(20).default([]),
  albumId: z.string().uuid().optional().or(z.literal("")),
});

// `z.infer` es el tipo de SALIDA (después de aplicar los `.default(...)`) —
// es lo que recibe el server action ya parseado. Para tipar un formulario
// de React Hook Form hace falta el tipo de ENTRADA (`z.input`), donde esos
// mismos campos siguen siendo opcionales — si no, zodResolver y el tipo
// del formulario no coinciden. Ver CreateMemoryFormInput más abajo.
export type CreateMemoryInput = z.infer<typeof createMemorySchema>;
export type CreateMemoryFormInput = z.input<typeof createMemorySchema>;

export const updateMemorySchema = createMemorySchema.partial().extend({
  id: z.string().uuid(),
});

export type UpdateMemoryInput = z.infer<typeof updateMemorySchema>;

export const EMOTION_OPTIONS = EMOTION_VALUES;
