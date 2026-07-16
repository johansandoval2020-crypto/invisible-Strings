"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, ImageOff } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/shared/lib/utils";
import type { MemorySummary } from "@/features/memories/domain/memory.entity";
import { toggleFavoriteAction } from "@/features/memories/presentation/actions/memory-actions";
import { useReducedMotionSafe } from "@/shared/hooks/use-reduced-motion-safe";

export function MemoryCard({ memory }: { memory: MemorySummary }) {
  const { prefersReducedMotion } = useReducedMotionSafe();

  return (
    <motion.div
      layoutId={`memory-${memory.id}`}
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="group border-border bg-card relative overflow-hidden rounded-2xl border shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-elevated)]"
    >
      <Link href={`/moments/${memory.id}`} className="block">
        <div className="bg-muted relative aspect-[4/3] w-full">
          {memory.coverImageUrl ? (
            <Image
              src={memory.coverImageUrl}
              alt={memory.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex size-full items-center justify-center">
              <ImageOff className="size-6" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 p-4">
          <p className="font-display text-foreground line-clamp-1 text-sm font-medium">
            {memory.title}
          </p>
          <div className="text-muted-foreground flex items-center gap-3 text-xs">
            <span>
              {memory.date.toLocaleDateString("es", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            {memory.locationName && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3" />
                {memory.locationName}
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleFavoriteAction(memory.id)}
        aria-label={memory.isFavorite ? "Quitar de favoritos" : "Marcar como favorito"}
        className={cn(
          "glass absolute top-3 right-3 flex size-8 items-center justify-center rounded-full transition-transform hover:scale-110",
        )}
      >
        <Heart
          className={cn(
            "size-4",
            memory.isFavorite ? "fill-pink-accent text-pink-accent" : "text-foreground",
          )}
        />
      </button>
    </motion.div>
  );
}
