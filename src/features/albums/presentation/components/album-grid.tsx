"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, arrayMove } from "@dnd-kit/sortable";

import type { AlbumSummary } from "@/features/albums/domain/album.entity";
import { AlbumCard } from "@/features/albums/presentation/components/album-card";
import { reorderAlbumsAction } from "@/features/albums/presentation/actions/album-actions";

export function AlbumGrid({ albums: initialAlbums }: { albums: AlbumSummary[] }) {
  const [albums, setAlbums] = React.useState(initialAlbums);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  React.useEffect(() => setAlbums(initialAlbums), [initialAlbums]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = albums.findIndex((a) => a.id === active.id);
    const newIndex = albums.findIndex((a) => a.id === over.id);
    const reordered = arrayMove(albums, oldIndex, newIndex);

    setAlbums(reordered);
    void reorderAlbumsAction(reordered.map((a) => a.id));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={albums.map((a) => a.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
