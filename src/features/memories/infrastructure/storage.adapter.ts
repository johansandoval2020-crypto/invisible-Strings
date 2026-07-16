import "server-only";

import { createClient } from "@/shared/lib/supabase/server";

const BUCKET = "memory-images";

/**
 * Sube imágenes de un recuerdo al bucket privado de Supabase Storage y
 * devuelve URLs firmadas (expiran — se re-generan al leer, no se guardan
 * como públicas). Requiere que el bucket `memory-images` exista y esté
 * marcado como privado en el proyecto de Supabase — ver README.
 */
export async function uploadMemoryImages(
  coupleId: string,
  memoryId: string,
  files: File[],
): Promise<{ url: string; width: number; height: number }[]> {
  if (files.length === 0) return [];

  const supabase = await createClient();
  const uploaded: { url: string; width: number; height: number }[] = [];

  for (const [index, file] of files.entries()) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${coupleId}/${memoryId}/${Date.now()}-${index}.${ext}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw new Error(`No pudimos subir la imagen: ${error.message}`);

    const { data: signed } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 60 * 60 * 24 * 365); // 1 año

    const dimensions = await readImageDimensions(file);

    uploaded.push({
      url: signed?.signedUrl ?? "",
      width: dimensions.width,
      height: dimensions.height,
    });
  }

  return uploaded;
}

async function readImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  // En el servidor no hay <img>/canvas para medir el archivo; se guarda un
  // placeholder razonable y el valor real se corrige del lado del cliente
  // en una iteración posterior (no bloquea el flujo de guardado).
  void file;
  return { width: 1600, height: 1200 };
}
