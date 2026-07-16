"use client";

import Image from "next/image";
import { Heart, MapPin, Calendar, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { MemoryDetail as MemoryDetailType } from "@/features/memories/domain/memory.entity";
import { EMOTION_LABELS } from "@/features/memories/domain/memory.entity";
import {
  toggleFavoriteAction,
  deleteMemoryAction,
} from "@/features/memories/presentation/actions/memory-actions";

export function MemoryDetail({ memory }: { memory: MemoryDetailType }) {
  const router = useRouter();

  async function handleDelete() {
    await deleteMemoryAction(memory.id);
    toast.success("Recuerdo movido a la papelera");
    router.push("/moments");
  }

  return (
    <div className="flex flex-col gap-6">
      {memory.images.length > 0 && (
        <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-2xl">
          <Image
            src={memory.images[0].url}
            alt={memory.title}
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-foreground text-2xl font-medium">
            {memory.title}
          </h1>
          <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              {memory.date.toLocaleDateString("es", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            {memory.locationName && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {memory.locationName}
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => toggleFavoriteAction(memory.id)}
            aria-label="Favorito"
          >
            <Heart
              className={memory.isFavorite ? "fill-pink-accent text-pink-accent" : ""}
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDelete}
            aria-label="Eliminar"
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      {memory.mood.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {memory.mood.map((m) => (
            <Badge key={m} variant="lavender">
              {EMOTION_LABELS[m]}
            </Badge>
          ))}
        </div>
      )}

      {memory.description && (
        <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
          {memory.description}
        </p>
      )}

      {(memory.tags.length > 0 || memory.people.length > 0) && (
        <div className="border-border flex flex-col gap-2 border-t pt-4">
          {memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {memory.tags.map((tag) => (
                <Badge key={tag.id} variant="outline">
                  #{tag.name}
                </Badge>
              ))}
            </div>
          )}
          {memory.people.length > 0 && (
            <p className="text-muted-foreground text-xs">
              Con {memory.people.map((p) => p.name).join(", ")}
            </p>
          )}
        </div>
      )}

      {memory.images.length > 1 && (
        <div className="grid grid-cols-3 gap-2">
          {memory.images.slice(1).map((img) => (
            <div
              key={img.id}
              className="bg-muted relative aspect-square overflow-hidden rounded-xl"
            >
              <Image src={img.url} alt="" fill sizes="200px" className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
