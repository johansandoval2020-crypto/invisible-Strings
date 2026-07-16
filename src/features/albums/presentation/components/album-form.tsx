"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  createAlbumSchema,
  type CreateAlbumInput,
} from "@/features/albums/application/schemas";
import { createAlbumAction } from "@/features/albums/presentation/actions/album-actions";

export function AlbumForm({ onSaved }: { onSaved?: () => void }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAlbumInput>({
    resolver: zodResolver(createAlbumSchema),
    defaultValues: { title: "", description: "" },
  });

  async function onSubmit(values: CreateAlbumInput) {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("description", values.description ?? "");

    const result = await createAlbumAction({}, formData);
    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Álbum creado");
    onSaved?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="album-title">Nombre</Label>
        <Input
          id="album-title"
          placeholder="Nuestro viaje a la playa"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-destructive text-xs">{errors.title.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="album-description">Descripción (opcional)</Label>
        <Textarea id="album-description" {...register("description")} />
      </div>
      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting && <Loader2 className="animate-spin" />}
        {isSubmitting ? "Creando…" : "Crear álbum"}
      </Button>
    </form>
  );
}
