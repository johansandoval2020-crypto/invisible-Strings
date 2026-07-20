-- Políticas de Storage para el bucket privado `memory-images`.
--
-- El bucket se crea vacío (sin políticas) al darlo de alta en Supabase
-- Storage — sin esto, Storage bloquea toda subida/lectura con "new row
-- violates row-level security policy", incluso siendo el bucket privado.
--
-- Convención de path: `{coupleId}/{memoryId}/{archivo}` — ver
-- src/features/memories/infrastructure/storage.adapter.ts. Tanto la subida
-- como la generación de signed URLs (createSignedUrl) se hacen con el
-- cliente autenticado del usuario (no service_role), así que RLS aplica
-- en ambos casos. Reutiliza `public.current_couple_id()` definida en
-- 0001_row_level_security.sql — debe correr después de esa migración.

create policy memory_images_storage_select on storage.objects
  for select
  using (
    bucket_id = 'memory-images'
    and (storage.foldername(name))[1] = public.current_couple_id()
  );

create policy memory_images_storage_insert on storage.objects
  for insert
  with check (
    bucket_id = 'memory-images'
    and (storage.foldername(name))[1] = public.current_couple_id()
  );

create policy memory_images_storage_update on storage.objects
  for update
  using (
    bucket_id = 'memory-images'
    and (storage.foldername(name))[1] = public.current_couple_id()
  );

create policy memory_images_storage_delete on storage.objects
  for delete
  using (
    bucket_id = 'memory-images'
    and (storage.foldername(name))[1] = public.current_couple_id()
  );
