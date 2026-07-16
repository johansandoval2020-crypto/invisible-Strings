"use client";

import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { MemoryDetail as MemoryDetailType } from "@/features/memories/domain/memory.entity";
import { MemoryDetail } from "@/features/memories/presentation/components/memory-detail";

/**
 * Versión interceptada de /moments/[memoryId]: mismo contenido que la
 * página completa, pero como Dialog superpuesto sobre el grid — ver
 * docs/ARCHITECTURE.md §5 (intercepting + parallel routes).
 */
export function MemoryModal({ memory }: { memory: MemoryDetailType }) {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={(open) => !open && router.back()}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>{memory.title}</DialogTitle>
        </DialogHeader>
        <MemoryDetail memory={memory} />
      </DialogContent>
    </Dialog>
  );
}
