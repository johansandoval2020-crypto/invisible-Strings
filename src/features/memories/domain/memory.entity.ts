import type { EmotionTag } from "@prisma/client";

export type { EmotionTag };

export const EMOTION_LABELS: Record<EmotionTag, string> = {
  HAPPY: "Feliz",
  EXCITED: "Emocionados",
  GRATEFUL: "Agradecidos",
  NOSTALGIC: "Nostálgicos",
  PEACEFUL: "En paz",
  ROMANTIC: "Románticos",
  SAD: "Tristes",
  BITTERSWEET: "Agridulce",
  PROUD: "Orgullosos",
  FUNNY: "Divertido",
};

export interface MemoryImageDTO {
  id: string;
  url: string;
  width: number;
  height: number;
  order: number;
  isCover: boolean;
  blurhash: string | null;
}

export interface MemorySummary {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  mood: EmotionTag[];
  isFavorite: boolean;
  coverImageUrl: string | null;
  locationName: string | null;
}

export interface MemoryDetail extends MemorySummary {
  weather: string | null;
  isHidden: boolean;
  albumId: string | null;
  images: MemoryImageDTO[];
  tags: { id: string; name: string; color: string }[];
  people: { id: string; name: string }[];
  createdAt: Date;
}
