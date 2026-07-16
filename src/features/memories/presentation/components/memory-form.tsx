"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  createMemorySchema,
  EMOTION_OPTIONS,
  type CreateMemoryFormInput,
} from "@/features/memories/application/schemas";
import { EMOTION_LABELS } from "@/features/memories/domain/memory.entity";
import { createMemoryAction } from "@/features/memories/presentation/actions/memory-actions";

export function MemoryForm({
  onSaved,
  defaultAlbumId,
}: {
  onSaved?: () => void;
  defaultAlbumId?: string;
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [images, setImages] = React.useState<File[]>([]);
  // Etiquetas y personas se editan como texto libre separado por coma en
  // vez de un campo controlado por RHF: el schema las tipa como array
  // (para que el server action las reciba ya separadas), pero como UI de
  // Fase 1 alcanza con un input de texto simple — la versión con chips
  // individuales queda para un pulido posterior.
  const [tagsText, setTagsText] = React.useState("");
  const [peopleText, setPeopleText] = React.useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateMemoryFormInput>({
    resolver: zodResolver(createMemorySchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().slice(0, 10),
      locationName: "",
      weather: "",
      mood: [],
      tagNames: [],
      peopleNames: [],
    },
  });

  async function onSubmit(values: CreateMemoryFormInput) {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("description", values.description ?? "");
    formData.set("date", values.date);
    formData.set("locationName", values.locationName ?? "");
    formData.set("weather", values.weather ?? "");
    (values.mood ?? []).forEach((m) => formData.append("mood", m));
    formData.set("tagNames", tagsText);
    formData.set("peopleNames", peopleText);
    if (defaultAlbumId) formData.set("albumId", defaultAlbumId);
    images.forEach((file) => formData.append("images", file));

    const result = await createMemoryAction({}, formData);
    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Recuerdo guardado");
    onSaved?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          placeholder="Nuestro primer viaje juntos"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-destructive text-xs">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Historia (opcional)</Label>
        <Textarea
          id="description"
          placeholder="Contá qué pasó, qué sintieron…"
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="date">Fecha</Label>
          <Input id="date" type="date" {...register("date")} />
          {errors.date && (
            <p className="text-destructive text-xs">{errors.date.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="locationName">Lugar (opcional)</Label>
          <Input
            id="locationName"
            placeholder="Antigua, Guatemala"
            {...register("locationName")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>¿Cómo se sintieron?</Label>
        <Controller
          control={control}
          name="mood"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {EMOTION_OPTIONS.map((emotion) => {
                const isSelected = field.value?.includes(emotion);
                return (
                  <button
                    key={emotion}
                    type="button"
                    onClick={() =>
                      field.onChange(
                        isSelected
                          ? (field.value ?? []).filter((e) => e !== emotion)
                          : [...(field.value ?? []), emotion],
                      )
                    }
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      isSelected
                        ? "border-lavender-accent bg-lavender-pastel text-foreground"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {EMOTION_LABELS[emotion]}
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tagNames">Etiquetas (separadas por coma)</Label>
          <Input
            id="tagNames"
            placeholder="viaje, playa"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="peopleNames">Personas presentes</Label>
          <Input
            id="peopleNames"
            placeholder="Vos, Yo"
            value={peopleText}
            onChange={(e) => setPeopleText(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="images">Fotos</Label>
        <label
          htmlFor="images"
          className="border-border text-muted-foreground hover:bg-muted flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed px-6 py-8 text-center text-sm"
        >
          <ImagePlus className="size-5" />
          {images.length > 0
            ? `${images.length} foto${images.length > 1 ? "s" : ""} seleccionada${images.length > 1 ? "s" : ""}`
            : "Elegí una o más fotos"}
        </label>
        <input
          id="images"
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => setImages(Array.from(e.target.files ?? []))}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting && <Loader2 className="animate-spin" />}
        {isSubmitting ? "Guardando…" : "Guardar recuerdo"}
      </Button>
    </form>
  );
}
