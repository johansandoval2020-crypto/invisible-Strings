-- Invisible String — Row Level Security
-- Ver docs/ARCHITECTURE.md §3.4 y §4.3 para el razonamiento completo.
--
-- Prisma gestiona el esquema (tablas, columnas, índices, foreign keys) vía
-- `prisma migrate`. Esta migración se aplica por separado, directamente en
-- Supabase (SQL Editor o el conector MCP), porque Prisma no administra
-- políticas de RLS de forma nativa. Debe correr DESPUÉS de que
-- `prisma migrate dev` haya creado las tablas.
--
-- Nota: Prisma mapea `String @id @default(uuid())` a columnas `text`, NO a
-- `uuid` nativo de Postgres — se comprobó corriendo el `\d` sobre la tabla
-- ya migrada. Por eso los helpers de acá trabajan en `text` (con cast
-- explícito de `auth.uid()`, que sí es `uuid` nativo) en vez de `uuid`
-- como haría un esquema con columnas uuid nativas.
--
-- Estrategia: cada tabla de tenant exige que `couple_id` coincida con el
-- claim `couple_id` inyectado al JWT de sesión por el Auth Hook definido
-- más abajo. Esto es defensa en profundidad: aunque el código de la app
-- ya filtra por coupleId en cada consulta, un bug ahí no debería poder
-- filtrar datos de otra pareja — la base de datos lo bloquea igual.

-- ---------------------------------------------------------------------
-- 1. Auth Hook: inyecta couple_id como custom claim en el JWT al login.
--    Configurar en Supabase Dashboard → Authentication → Hooks →
--    "Customize Access Token (JWT) Claims" apuntando a esta función.
-- ---------------------------------------------------------------------
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  user_couple_id text;
begin
  select "coupleId" into user_couple_id
  from public.users
  where id = (event->>'user_id');

  claims := event->'claims';

  if user_couple_id is not null then
    claims := jsonb_set(claims, '{couple_id}', to_jsonb(user_couple_id));
  end if;

  event := jsonb_set(event, '{claims}', claims);
  return event;
end;
$$;

alter function public.custom_access_token_hook(jsonb) set search_path = public;

grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook to supabase_auth_admin;
grant select on public.users to supabase_auth_admin;

-- ---------------------------------------------------------------------
-- 2. Helper: extrae couple_id (text) del JWT actual.
-- ---------------------------------------------------------------------
create or replace function public.current_couple_id()
returns text
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb->>'couple_id', '');
$$;

alter function public.current_couple_id() set search_path = public;

-- ---------------------------------------------------------------------
-- 3. RLS por tabla de tenant.
--    Nomenclatura de tablas según @@map(...) en prisma/schema.prisma.
-- ---------------------------------------------------------------------
alter table public.couples enable row level security;
create policy couples_isolation on public.couples
  using (id = public.current_couple_id());

alter table public.users enable row level security;
create policy users_isolation on public.users
  using (id = auth.uid()::text or "coupleId" = public.current_couple_id());

alter table public.memories enable row level security;
create policy memories_isolation on public.memories
  using ("coupleId" = public.current_couple_id());

alter table public.memory_images enable row level security;
create policy memory_images_isolation on public.memory_images
  using (exists (
    select 1 from public.memories m
    where m.id = memory_images."memoryId"
    and m."coupleId" = public.current_couple_id()
  ));

alter table public.memory_relations enable row level security;
create policy memory_relations_isolation on public.memory_relations
  using (exists (
    select 1 from public.memories m
    where m.id = memory_relations."sourceMemoryId"
    and m."coupleId" = public.current_couple_id()
  ));

alter table public.albums enable row level security;
create policy albums_isolation on public.albums
  using ("coupleId" = public.current_couple_id());

alter table public.tags enable row level security;
create policy tags_isolation on public.tags
  using ("coupleId" = public.current_couple_id());

alter table public.memory_tags enable row level security;
create policy memory_tags_isolation on public.memory_tags
  using (exists (
    select 1 from public.memories m
    where m.id = memory_tags."memoryId"
    and m."coupleId" = public.current_couple_id()
  ));

alter table public.people enable row level security;
create policy people_isolation on public.people
  using ("coupleId" = public.current_couple_id());

alter table public.memory_people enable row level security;
create policy memory_people_isolation on public.memory_people
  using (exists (
    select 1 from public.memories m
    where m.id = memory_people."memoryId"
    and m."coupleId" = public.current_couple_id()
  ));

alter table public.locations enable row level security;
create policy locations_isolation on public.locations
  using ("coupleId" = public.current_couple_id());

alter table public.letters enable row level security;
create policy letters_isolation on public.letters
  using ("coupleId" = public.current_couple_id());

alter table public.songs enable row level security;
create policy songs_isolation on public.songs
  using ("coupleId" = public.current_couple_id());

alter table public.memory_songs enable row level security;
create policy memory_songs_isolation on public.memory_songs
  using (exists (
    select 1 from public.memories m
    where m.id = memory_songs."memoryId"
    and m."coupleId" = public.current_couple_id()
  ));

alter table public.calendar_events enable row level security;
create policy calendar_events_isolation on public.calendar_events
  using ("coupleId" = public.current_couple_id());

alter table public.favorites enable row level security;
create policy favorites_isolation on public.favorites
  using ("coupleId" = public.current_couple_id());
