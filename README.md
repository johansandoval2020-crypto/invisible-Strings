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

## Variables de entorno

Ver `.env.example` para la lista completa. Como mínimo, para desarrollo
local necesitás:

- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Project
  Settings → API en tu proyecto de Supabase.
- `DATABASE_URL` y `DIRECT_URL` — Project Settings → Database (usar el
  connection pooler para `DATABASE_URL` y la conexión directa para
  `DIRECT_URL`, que es la que usa Prisma para migraciones).

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

## Roadmap

El desarrollo avanza por fases (ver `docs/ARCHITECTURE.md` §9). Este
commit inicial cubre la **Fase 0 — Fundaciones**: estructura del proyecto,
Design System aplicado a Tailwind, esquema de base de datos, primitivos de
UI, navegación completa (desktop + mobile), auth con Supabase (login,
signup, esqueleto de emparejamiento de pareja) y CI en GitHub Actions.
