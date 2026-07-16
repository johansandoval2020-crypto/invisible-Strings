"use client";

import Link from "next/link";
import Image from "next/image";
import { FolderHeart, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/shared/lib/utils";
import type { AlbumSummary } from "@/features/albums/domain/album.entity";

export function AlbumCard({ album }: { album: AlbumSummary }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: album.id,
    });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group border-border bg-card relative overflow-hidden rounded-2xl border shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-elevated)]",
        isDragging && "z-10 opacity-70",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Arrastrar para reordenar"
        className="glass absolute top-2 left-2 z-10 flex size-7 cursor-grab items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="size-3.5" />
      </button>

      <Link href={`/albums/${album.id}`} className="block">
        <div className="bg-muted relative aspect-[4/3] w-full">
          {album.coverImageUrl ? (
            <Image
              src={album.coverImageUrl}
              alt={album.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex size-full items-center justify-center">
              <FolderHeart className="size-6" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 p-4">
          <p className="font-display text-foreground line-clamp-1 text-sm font-medium">
            {album.title}
          </p>
          <p className="text-muted-foreground text-xs">
            {album.memoryCount} recuerdo{album.memoryCount !== 1 ? "s" : ""}
          </p>
        </div>
      </Link>
    </div>
  );
}
