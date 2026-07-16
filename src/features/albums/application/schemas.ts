import { z } from "zod";

export const createAlbumSchema = z.object({
  title: z.string().trim().min(1, "Ponele un nombre al álbum").max(120),
  description: z.string().trim().max(500).optional().or(z.literal("")),
});

export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;

export const reorderAlbumsSchema = z.object({
  orderedIds: z.array(z.string().uuid()).min(1),
});

export type ReorderAlbumsInput = z.infer<typeof reorderAlbumsSchema>;
