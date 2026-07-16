"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

/**
 * Versión interceptada de /moments/[memoryId]: mismo contenido, pero
 * renderizado como Dialog superpuesto sobre el grid de /moments en vez
 * de una navegación de página completa. El layoutId de Framer Motion
 * que anima tarjeta → modal se conecta acá en la Fase 2.
 */
export default function InterceptedMemoryModal({
  params,
}: {
  params: Promise<{ memoryId: string }>;
}) {
  const { memoryId } = React.use(params);
  const router = useRouter();

  return (
    <Dialog open onOpenChange={(open) => !open && router.back()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Recuerdo</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Vista inmersiva del recuerdo{" "}
          <span className="text-foreground font-mono">{memoryId}</span> — se implementa
          en la Fase 2.
        </p>
      </DialogContent>
    </Dialog>
  );
}
