"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { MemoryForm } from "@/features/memories/presentation/components/memory-form";

export function CreateMemoryDialog({
  trigger,
  defaultAlbumId,
}: {
  trigger?: React.ReactNode;
  defaultAlbumId?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button>Agregar recuerdo</Button>}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo recuerdo</DialogTitle>
        </DialogHeader>
        <MemoryForm
          defaultAlbumId={defaultAlbumId}
          onSaved={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
