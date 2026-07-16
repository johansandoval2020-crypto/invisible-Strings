# Invisible String

Un espacio privado para que una pareja guarde, organice y reviva sus
recuerdos más importantes. No es una galería de fotos: cada recuerdo tiene
contexto, historia, ubicación, música y emociones asociadas.

La especificación completa (análisis, arquitectura, base de datos, sistema
de componentes, navegación, design system y roadmap) vive en
[`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — léelo antes de tocar
código nuevo, ahí está el porqué de cada decisión.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
componentes propios estilo shadcn/ui sobre Radix UI · Framer Motion ·
Supabase (Auth + Storage) · PostgreSQL vía Prisma · Zustand · TanStack
Query · React Hook Form + Zod.

## Requisitos

Node 22+, npm, y un proyecto de [Supabase](https://supabase.com) (gratis
para desarrollo).

## Setup local

```bash
npm install
cp .env.example .env.local   # completar con las credenciales reales
npx prisma generate
npx prisma migrate dev       # crea las tablas en tu base de datos de Supabase
npm run dev
```

La app queda en `http://localhost:3000`.

Además de las tablas, las fotos de los recuerdos necesitan un bucket de
Supabase Storage: en el dashboard de tu proyecto, Storage → New bucket →
nombre `memory-images`, marcado como **privado** (no público — las
imágenes se sirven con URLs firmadas, ver
`src/features/memories/infrastructure/storage.adapter.ts`).

También aplicá las políticas de Row Level Security una vez corridas las
migraciones de Prisma: pegá el contenido de
`supabase/migrations/0001_row_level_security.sql` en el SQL Editor de
Supabase y ejecutalo (ver docs/ARCHITECTURE.md §4.3).

## Variables de entorno

Ver `.env.example` para la lista completa. Como mínimo, para desarrollo
local necesitás:

- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Project
  Settings → API en tu proyecto de Supabase.
- `DATABASE_URL` y `DIRECT_URL` — Project Settings → Database (usar el
  connection pooler para `DATABASE_URL`, que es la que usa la app en
  runtime vía `@prisma/adapter-pg`; y la conexión directa/session pooler
  para `DIRECT_URL`, que usa `prisma.config.ts` para las migraciones).

Spotify, Resend (email) y Sentry son opcionales hasta las fases 3–6 del
roadmap.

## Scripts

| Script                            | Qué hace                                                         |
| --------------------------------- | ---------------------------------------------------------------- |
| `npm run dev`                     | Servidor de desarrollo                                           |
| `npm run build`                   | Build de producción                                              |
| `npm run lint`                    | ESLint                                                           |
| `npm run typecheck`               | `tsc --noEmit`                                                   |
| `npm run format` / `format:check` | Prettier                                                         |
| `npm run prisma:generate`         | Regenera el cliente de Prisma tras editar `prisma/schema.prisma` |
| `npm run prisma:migrate`          | Crea y aplica una migración nueva                                |

Un hook de pre-commit (Husky + lint-staged) corre ESLint y Prettier sobre
los archivos modificados antes de cada commit.

## Estructura del proyecto

```
src/
  app/            # Next.js App Router — solo routing y composición de página
  features/       # Un módulo por dominio de negocio (memories, albums, letters…),
                   # cada uno con sus 4 capas: domain / application / infrastructure / presentation
  shared/         # Componentes UI, hooks, stores, config y clientes (Prisma, Supabase) transversales
prisma/
  schema.prisma   # Esquema completo de base de datos
supabase/
  migrations/     # Políticas de Row Level Security (no gestionadas por Prisma)
docs/
  ARCHITECTURE.md # Especificación técnica completa del proyecto
```

Cada feature es, en la práctica, removible: borrar `src/features/music/`
no debería romper la compilación del resto de la app. Ver
`docs/ARCHITECTURE.md` §3 y §8 para el razonamiento completo.

## Nota sobre este scaffold inicial

Este proyecto se generó y verificó dentro de un entorno con acceso de red
restringido (sin salida a `fonts.googleapis.com`, `binaries.prisma.sh` ni
`ui.shadcn.com`), así que dos pasos quedan pendientes de correr en un
entorno con red normal — local, CI, o Vercel — antes del primer deploy:

1. `npx prisma generate` — descarga el motor de Prisma y genera el cliente
   tipado (`@prisma/client`). El código que lo usa (`src/shared/lib/prisma.ts`)
   ya está escrito y es correcto; solo faltó este paso, que no pudo
   ejecutarse en el entorno donde se armó el scaffold.
2. El primer `next build`/`next dev` va a descargar los archivos de las
   fuentes Inter y Geist desde Google Fonts automáticamente — no requiere
   ninguna acción manual, solo red disponible.

El resto del proyecto (lint, typecheck, y un `next build` completo con las
fuentes temporalmente stubeadas para poder verificar sin esa red) ya se
comprobó sin errores antes de esta primera entrega.

### Cambio real de Prisma 7: conexión ya no vive en `schema.prisma`

Esta versión de Prisma (7.8.0) rompió compatibilidad respecto a lo que era
estándar hasta hace poco: `datasource db { url = env(...) directUrl = ... }`
ya no es válido en `schema.prisma` (error `P1012`), y `new PrismaClient()`
sin argumentos tampoco funciona más. Esto se descubrió y resolvió durante
el setup — no es un bug de este proyecto, es un cambio de la librería. La
solución ya está aplicada:

- `prisma.config.ts` (nuevo, raíz del proyecto) — le dice a la CLI de
  Prisma (`migrate`, `studio`, etc.) qué `DIRECT_URL` usar. Carga
  `.env.local` a mano porque la CLI corre por fuera de Next.
- `src/shared/lib/prisma.ts` — ahora arma un `@prisma/adapter-pg` con
  `DATABASE_URL` (el pooler) y se lo pasa a `new PrismaClient({ adapter })`,
  que es el único constructor válido en esta versión.
- `next.config.ts` — se agregó `serverExternalPackages` para `pg` y los
  paquetes de Prisma, para que Next no intente empaquetarlos.

Si en el futuro ves un error `P1012` sobre `url`/`directUrl` en
`schema.prisma`, o `new PrismaClient()` se queja de que falta `adapter`,
es este mismo cambio de versión — no hace falta re-investigarlo.

## Roadmap

El desarrollo avanza por fases (ver `docs/ARCHITECTURE.md` §9).

**Fase 0 — Fundaciones.** Estructura del proyecto, Design System aplicado
a Tailwind, esquema de base de datos, primitivos de UI, navegación
completa (desktop + mobile) y CI en GitHub Actions.

**Fase 1 — MVP funcional.** Flujo de emparejamiento de pareja completo
(crear espacio / unirse por invitación), CRUD de recuerdos con subida de
imágenes a Supabase Storage, CRUD de álbumes con reordenamiento por
arrastre (dnd-kit), timeline agrupado por año, favoritos, y el dashboard
conectado a datos reales (días juntos, último recuerdo, recuerdo
aleatorio). Sin los carruseles estilo Netflix ni el modo "Revivir este
momento" todavía — eso es Fase 2.

Ninguna de las dos fases pudo probarse contra una base de datos real
dentro del entorno donde se armaron (sin salida de red a
`binaries.prisma.sh` para generar el cliente de Prisma) — el código está
completo y revisado, pero el primer smoke test real queda pendiente para
cuando corras `prisma generate` + `prisma migrate dev` con tus
credenciales de Supabase.
