# Invisible String — Especificación Técnica y Arquitectura

**Versión:** 1.0 · **Fecha:** 15 de julio de 2026 · **Autor:** Staff Engineering (diseño colaborativo con Johan)

**Cómo leer este documento.** Sigue el orden que pediste: primero el análisis crítico del brief y las mejoras propuestas, luego la arquitectura, la base de datos, el sistema de componentes, la navegación, el design system, la estructura de carpetas y por último el roadmap de fases. Ningún código de producto se escribe todavía — este documento es la base que aprobamos juntos antes de tocar el editor.

---

## 1. Resumen ejecutivo

Invisible String es una aplicación privada para parejas, pensada como un santuario digital de recuerdos compartidos. El stack que propusiste (Next.js 15, React 19, TypeScript, Tailwind 4, Supabase, Prisma) es sólido, moderno y coherente entre sí — no hay fricción tecnológica entre las piezas, y todas soportan bien Server Components, streaming y edge rendering. Mi trabajo en este documento es tomar ese stack y envolverlo en una arquitectura que aguante crecimiento (más parejas, más módulos, más datos por pareja) sin que el código se vuelva frágil, y señalar los puntos donde el brief original deja huecos que, si no se resuelven ahora, se pagan caro más adelante: el mecanismo de emparejamiento entre los dos usuarios de una pareja, el aislamiento de datos entre parejas (aunque hoy sea "una pareja, una instancia", el propio brief la llama SaaS, así que la diseño multi-tenant desde el día uno), la seguridad de contenido sensible como las cartas, y la estrategia de rendimiento para una experiencia tan cargada de imágenes y animación.

---

## 2. Análisis del proyecto y mejoras propuestas

### 2.1 Fortalezas del brief

La identidad emocional está muy bien definida — calma, romanticismo, elegancia — y eso es raro de ver en un brief técnico; la mayoría se queda en "quiero una app bonita". Tener paleta, tipografía y referencias de animación desde el inicio evita el vaivén típico de "no me gusta cómo se ve" a mitad de desarrollo. La lista de secciones (Inicio, Momentos, Álbumes, Timeline, Cartas, Música, Calendario, Favoritos, Buscador, Dashboard) cubre de forma natural el ciclo de vida completo de un recuerdo: se crea, se organiza, se relee, se revive. Y la elección de stack ya anticipa buenas prácticas — Server Actions, Zod, TanStack Query — lo cual me dice que no estamos partiendo de cero en criterio técnico.

### 2.2 Vacíos que hay que resolver antes de escribir código

**Emparejamiento de la pareja.** El brief no especifica cómo dos personas se convierten en "una pareja" dentro del sistema. Sin esto no hay app: hace falta un flujo de invitación (código o enlace único, con expiración) donde el primer usuario crea el espacio de la pareja y el segundo se une. Esto también define el límite de tenant para todo lo demás.

**Privacidad real, no solo visual.** Es una app que va a contener cartas de amor y fotos íntimas. Eso obliga a diseñar seguridad desde la base de datos hacia arriba: Row Level Security en Postgres (no solo checks en el backend), URLs firmadas y con expiración para las imágenes en Supabase Storage en vez de buckets públicos, y la opción de marcar un recuerdo o una carta como "oculto" detrás de un PIN o biometría del dispositivo.

**Multi-tenancy real.** El brief lo llama "producto SaaS", así que aunque el primer despliegue sea para una sola pareja, voy a modelar la base de datos para que cada pareja sea un tenant aislado desde el día uno (`coupleId` en cada tabla + políticas RLS). Hacerlo después implica una migración de datos dolorosa; hacerlo ahora cuesta lo mismo que no hacerlo.

**Notificaciones.** Tienes cartas programadas para abrirse en una fecha futura, cuentas regresivas de aniversarios y cumpleaños — todo eso pierde la mitad de su magia si nadie avisa cuando ocurre. Propongo un sistema de notificaciones (email transaccional vía Resend, y push web opcional) enganchado a estos eventos.

**Accesibilidad y `prefers-reduced-motion`.** Pediste animación fluida en todas partes (Framer Motion, shared layout, blur, scale). Sin una capa de respeto a `prefers-reduced-motion` y sin verificar contraste de la paleta pastel, la app puede terminar siendo bonita pero excluyente. Lo trato en el Design System (sección 7).

**Estrategia de medios.** El brief habla de "imágenes", pero una app de recuerdos de pareja pide también video corto y notas de voz. Y toda imagen subida necesita un pipeline de optimización (resize, formatos modernos, blurhash para placeholders) o el rendimiento se cae en cuanto haya un álbum con 200 fotos.

**Papelera, no borrado directo.** Borrar un recuerdo o una carta por accidente en una app así es un desastre emocional, no solo un bug. Propongo soft-delete con papelera de 30 días en vez de `DELETE` directo.

**Testing, CI/CD y observabilidad.** El brief no lo menciona, pero "lista para producción" lo exige: pipeline de CI (typecheck, lint, tests) en GitHub Actions, despliegue en Vercel con preview deployments, y tracking de errores (Sentry) — sin esto, "producción" es una palabra vacía.

### 2.3 Funcionalidades adicionales propuestas

Estas son adiciones al alcance original que refuerzan la idea de "no es una galería tradicional" y que se pueden aceptar o descartar una por una — no son obligatorias, son propuestas de valor:

El **modo "Revivir este momento"** merece ser más que un botón que abre una vista de detalle: propongo que dispare una experiencia de pantalla completa tipo slideshow cinematográfico, con efecto Ken Burns sobre las fotos del recuerdo, transiciones suaves entre ellas y la canción asociada sonando de fondo. Es literalmente el corazón emocional del producto y el brief lo deja como una línea suelta.

**"Un día como hoy"** — un widget de dashboard y una sección que resurface recuerdos de la misma fecha en años anteriores, al estilo de los recuerdos de Facebook pero curado con la identidad visual propia. Es una de las mecánicas de retención más efectivas que existen para este tipo de producto y usa un dato (la fecha) que ya vas a capturar de todas formas.

Un **mapa de recuerdos** — dado que cada recuerdo tiene ubicación, una vista de mapa con pines agrupados por lugar es una forma de navegación completamente distinta al carrusel y al timeline, y refuerza que esto no es una galería.

Un **modo nocturno** ("Bajo las estrellas") como alternativa al tema claro — coherente con la identidad romántica (cielo nocturno, tonos índigo y dorados suaves) y con un caso de uso real: mucha gente revisa recuerdos de noche antes de dormir.

**Notas de voz** adjuntas a un recuerdo, como complemento a fotos y música — capturar una risa o una frase dicha en el momento tiene un peso emocional que ninguna foto reemplaza.

**Exportar como libro de recuerdos en PDF** — convertir un álbum o un rango de tiempo en un documento descargable/imprimible. Es una función de "salida" que le da permanencia a los datos fuera de la app.

**Estadísticas de la relación** en el dashboard — racha de días agregando recuerdos, palabras escritas en cartas, canción más repetida, mapa de emociones a lo largo del tiempo. Convierte el dashboard en algo vivo en vez de una lista estática de widgets.

**PWA instalable** con caché básico de los recuerdos vistos recientemente, para que la app se sienta como una app nativa en el teléfono y funcione con conectividad intermitente.

Todas estas están reflejadas en el roadmap (sección 9) como fases opcionales posteriores al MVP, no como bloqueantes.

---

## 3. Arquitectura completa

### 3.1 Principios rectores

La arquitectura sigue **Clean Architecture aplicada por feature** (a veces llamada "screaming architecture" + hexagonal): en vez de una sola capa de dominio para toda la app, cada módulo de negocio (`memories`, `albums`, `letters`, `timeline`, `music`, `calendar`, `favorites`, `dashboard`, `auth`) es una rebanada vertical con sus propias cuatro capas internas. Esto es deliberado: con Feature-Based puro (sin capas dentro de cada feature) el código tiende a mezclar UI y lógica de negocio rápido; con Clean Architecture pura (capas globales sin features) el código se vuelve difícil de navegar en un proyecto con tantos módulos como este. La combinación da lo mejor de ambos: cada feature es independiente y removible, y dentro de cada feature la lógica de negocio no sabe nada de React ni de Supabase.

Las cuatro capas dentro de cada feature, de adentro hacia afuera:

**Domain** contiene las entidades y reglas de negocio puras — tipos TypeScript, invariantes (por ejemplo, "una carta programada no puede tener fecha de apertura en el pasado"), y las interfaces de los repositorios (los "puertos"). No importa nada de Next.js, Prisma o Supabase. Es el código más estable del proyecto y el más fácil de testear con unit tests puros.

**Application** contiene los casos de uso (`createMemory`, `scheduleLetterOpening`, `reorderAlbumItems`) que orquestan el dominio. Dependen solo de las interfaces del dominio, nunca de una implementación concreta — así el caso de uso "crear un recuerdo" no sabe si los datos terminan en Postgres vía Prisma o en otro lado.

**Infrastructure** implementa esas interfaces: los repositorios concretos con Prisma Client, el adaptador de Supabase Storage para subir imágenes, el cliente de la API de Spotify. Es la única capa que puede importar `@prisma/client` o el SDK de Supabase.

**Presentation** es todo lo que toca React: Server Components que llaman a los casos de uso directamente en el servidor, Server Actions que exponen mutaciones al cliente, hooks de TanStack Query para estado de servidor en el cliente, componentes y las tiendas de Zustand para estado de UI efímero.

La regla de dependencia es estricta y en una sola dirección: `presentation → application → domain ← infrastructure`. Infrastructure implementa el dominio pero nunca lo importa "hacia arriba"; presentation nunca importa infrastructure directamente, siempre pasa por application. Esto es lo que en la práctica evita el problema más común de las apps Next.js grandes: lógica de negocio duplicada entre un Server Action y un route handler porque nadie las centralizó.

### 3.2 Cómo esto mapea a SOLID

Cada repositorio y cada servicio tiene una sola razón para cambiar (**S**): `MemoryRepository` solo sabe persistir y consultar recuerdos, `MemoryReplayService` solo sabe armar la experiencia de "revivir" un momento — no se mezclan. Los canales de notificación (email, push) se modelan como una interfaz `NotificationChannel` con implementaciones intercambiables, así que agregar un canal nuevo (SMS, por ejemplo) no requiere tocar el código existente (**O**). Cualquier implementación de un puerto del dominio — el adaptador de Supabase Storage hoy, un adaptador de S3 mañana si migramos — es sustituible sin que el caso de uso que lo consume note la diferencia (**L**). Las interfaces se mantienen chicas y específicas: `MemoryReader` y `MemoryWriter` en vez de un `MemoryRepository` gigante que todo consumidor tiene que implementar entero aunque solo necesite leer (**I**). Y la capa de aplicación depende de abstracciones definidas en el dominio, no de las clases concretas de infraestructura, inyectadas mediante funciones factory simples — sin necesidad de un framework de DI pesado, que sería excesivo para el tamaño de este proyecto (**D**).

### 3.3 Dónde vive la lógica según el tipo de operación

Para lecturas iniciales de página se usan **Server Components** que llaman directamente a los casos de uso de `application/` en el servidor — sin pasar por una API HTTP intermedia, porque no hay necesidad: el Server Component y el caso de uso corren en el mismo proceso. Esto habilita streaming con `<Suspense>` por sección (el hero puede pintar antes que el tercer carrusel termine de cargar).

Para mutaciones desde el cliente (crear un recuerdo, marcar un favorito, reordenar un álbum) se usan **Server Actions**, que actúan como el adaptador entre presentation y application: validan el input con Zod, llaman al caso de uso, y devuelven un resultado tipado. El cliente nunca llama a Prisma ni a Supabase directamente.

Para estado que necesita reactividad fina en el cliente — listas que se actualizan optimistamente, búsqueda con debounce, datos que se refrescan en background — se usa **TanStack Query**, hidratado inicialmente con los datos que ya vinieron del Server Component (evitando el "doble fetch" típico). **Zustand** se reserva exclusivamente para estado de interfaz que no vive en el servidor: qué modal está abierto, filtros activos del buscador, tema claro/oscuro, estado del reproductor de música mini.

Para tiempo real (que tu pareja vea un recuerdo nuevo aparecer sin refrescar) se usa **Supabase Realtime**, suscrito por `coupleId`, invalidando las queries de TanStack Query correspondientes cuando llega un evento.

### 3.4 Multi-tenancy y seguridad en profundidad

Cada tabla de datos de pareja lleva `coupleId`. La aplicación filtra por `coupleId` en cada consulta (primera capa), y además cada tabla tiene una política de **Row Level Security** de Postgres que exige que `coupleId` coincida con el claim `couple_id` del JWT de sesión (segunda capa, a nivel de base de datos). Esto significa que incluso si un caso de uso tuviera un bug y olvidara filtrar por pareja, la base de datos rechazaría la fuga de datos. Es defensa en profundidad, no redundancia innecesaria — para una app que guarda cartas de amor, el costo de un bug de aislamiento es demasiado alto para confiar en una sola capa.

---

## 4. Diseño de base de datos

### 4.1 Modelo entidad-relación (resumen)

`User` pertenece a un `Couple` (dos usuarios por pareja en el MVP, modelado de forma que en el futuro no sea imposible extenderlo). `Couple` es el tenant raíz: de ahí cuelgan `Memory`, `Album`, `Letter`, `Song`, `CalendarEvent`, `Tag`, `Location` y `Person`. Un `Memory` puede pertenecer a un `Album`, tiene muchas `MemoryImage`, se relaciona con `Tag` mediante una tabla puente, con `Person` mediante otra, puede enlazar canciones a través de `MemorySong` (con un rol: favorita, playlist o música del momento), puede vincularse a otros recuerdos relacionados (relación reflexiva), y puede tener una `Location`. `Letter` pertenece a un autor (`User`) dentro de la pareja. `Favorite` es una tabla polimórfica simple que guarda `targetType` + `targetId`, evitando cuatro tablas de favoritos casi idénticas.

### 4.2 Prisma Schema

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum EmotionTag {
  HAPPY
  EXCITED
  GRATEFUL
  NOSTALGIC
  PEACEFUL
  ROMANTIC
  SAD
  BITTERSWEET
  PROUD
  FUNNY
}

enum MemoryRole {
  FAVORITE_SONG
  PLAYLIST
  MOMENT_SONG
}

enum FavoriteTargetType {
  MEMORY
  ALBUM
  LETTER
  SONG
}

enum CalendarEventType {
  BIRTHDAY
  ANNIVERSARY
  TRIP
  CUSTOM
}

model Couple {
  id                    String    @id @default(uuid())
  name                  String?
  relationshipStartDate DateTime
  anniversaryDate       DateTime?
  inviteCode            String    @unique @default(uuid())
  inviteExpiresAt       DateTime?
  themePreference       String    @default("light") // "light" | "night"
  timezone              String    @default("America/El_Salvador")
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  members        User[]
  memories       Memory[]
  albums         Album[]
  letters        Letter[]
  songs          Song[]
  tags           Tag[]
  locations      Location[]
  people         Person[]
  calendarEvents CalendarEvent[]
  favorites      Favorite[]

  @@index([inviteCode])
}

model User {
  id            String   @id @default(uuid()) // igual al id de Supabase Auth
  email         String   @unique
  displayName   String
  avatarUrl     String?
  coupleId      String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  couple         Couple?         @relation(fields: [coupleId], references: [id], onDelete: SetNull)
  createdMemories Memory[]       @relation("MemoryAuthor")
  letters         Letter[]       @relation("LetterAuthor")
  favorites       Favorite[]

  @@index([coupleId])
}

model Memory {
  id          String       @id @default(uuid())
  coupleId    String
  title       String
  description String?
  date        DateTime
  mood        EmotionTag[]
  weather     String?
  isFavorite  Boolean      @default(false)
  isHidden    Boolean      @default(false)
  albumId     String?
  locationId  String?
  createdById String
  deletedAt   DateTime?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  couple        Couple          @relation(fields: [coupleId], references: [id], onDelete: Cascade)
  createdBy     User            @relation("MemoryAuthor", fields: [createdById], references: [id])
  album         Album?          @relation(fields: [albumId], references: [id], onDelete: SetNull)
  location      Location?       @relation(fields: [locationId], references: [id], onDelete: SetNull)
  images        MemoryImage[]
  tags          MemoryTag[]
  people        MemoryPerson[]
  songs         MemorySong[]
  relatedFrom   MemoryRelation[] @relation("RelationSource")
  relatedTo     MemoryRelation[] @relation("RelationTarget")

  @@index([coupleId, date])
  @@index([coupleId, isFavorite])
  @@index([coupleId, deletedAt])
}

model MemoryImage {
  id        String   @id @default(uuid())
  memoryId  String
  url       String
  width     Int
  height    Int
  order     Int      @default(0)
  isCover   Boolean  @default(false)
  blurhash  String?
  createdAt DateTime @default(now())

  memory Memory @relation(fields: [memoryId], references: [id], onDelete: Cascade)

  @@index([memoryId, order])
}

model MemoryRelation {
  id               String @id @default(uuid())
  sourceMemoryId   String
  targetMemoryId   String

  source Memory @relation("RelationSource", fields: [sourceMemoryId], references: [id], onDelete: Cascade)
  target Memory @relation("RelationTarget", fields: [targetMemoryId], references: [id], onDelete: Cascade)

  @@unique([sourceMemoryId, targetMemoryId])
}

model Album {
  id          String    @id @default(uuid())
  coupleId    String
  title       String
  description String?
  coverImageUrl String?
  order       Int       @default(0)
  deletedAt   DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  couple   Couple   @relation(fields: [coupleId], references: [id], onDelete: Cascade)
  memories Memory[]

  @@index([coupleId, order])
}

model Tag {
  id        String   @id @default(uuid())
  coupleId  String
  name      String
  color     String   @default("#F2B8CC")
  createdAt DateTime @default(now())

  couple  Couple      @relation(fields: [coupleId], references: [id], onDelete: Cascade)
  memories MemoryTag[]

  @@unique([coupleId, name])
}

model MemoryTag {
  memoryId String
  tagId    String

  memory Memory @relation(fields: [memoryId], references: [id], onDelete: Cascade)
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([memoryId, tagId])
}

model Person {
  id        String   @id @default(uuid())
  coupleId  String
  name      String
  avatarUrl String?
  createdAt DateTime @default(now())

  couple  Couple         @relation(fields: [coupleId], references: [id], onDelete: Cascade)
  memories MemoryPerson[]

  @@unique([coupleId, name])
}

model MemoryPerson {
  memoryId String
  personId String

  memory Memory @relation(fields: [memoryId], references: [id], onDelete: Cascade)
  person Person @relation(fields: [personId], references: [id], onDelete: Cascade)

  @@id([memoryId, personId])
}

model Location {
  id        String   @id @default(uuid())
  coupleId  String
  name      String
  address   String?
  lat       Float?
  lng       Float?
  createdAt DateTime @default(now())

  couple   Couple   @relation(fields: [coupleId], references: [id], onDelete: Cascade)
  memories Memory[]

  @@unique([coupleId, name])
  @@index([coupleId, lat, lng])
}

model Letter {
  id              String    @id @default(uuid())
  coupleId        String
  authorId        String
  title           String
  contentMarkdown String
  scheduledOpenAt DateTime?
  openedAt        DateTime?
  isArchived      Boolean   @default(false)
  deletedAt       DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  couple Couple @relation(fields: [coupleId], references: [id], onDelete: Cascade)
  author User   @relation("LetterAuthor", fields: [authorId], references: [id])

  @@index([coupleId, scheduledOpenAt])
  @@index([coupleId, isArchived])
}

model Song {
  id             String   @id @default(uuid())
  coupleId       String
  spotifyTrackId String
  title          String
  artist         String
  albumArtUrl    String?
  previewUrl     String?
  spotifyUrl     String
  createdAt      DateTime @default(now())

  couple  Couple       @relation(fields: [coupleId], references: [id], onDelete: Cascade)
  memories MemorySong[]

  @@unique([coupleId, spotifyTrackId])
}

model MemorySong {
  memoryId String
  songId   String
  role     MemoryRole @default(MOMENT_SONG)

  memory Memory @relation(fields: [memoryId], references: [id], onDelete: Cascade)
  song   Song   @relation(fields: [songId], references: [id], onDelete: Cascade)

  @@id([memoryId, songId, role])
}

model CalendarEvent {
  id               String            @id @default(uuid())
  coupleId         String
  title            String
  type             CalendarEventType
  date             DateTime
  isRecurringYearly Boolean          @default(true)
  linkedMemoryId   String?
  createdAt        DateTime          @default(now())

  couple Couple @relation(fields: [coupleId], references: [id], onDelete: Cascade)

  @@index([coupleId, date])
}

model Favorite {
  id         String             @id @default(uuid())
  coupleId   String
  userId     String
  targetType FavoriteTargetType
  targetId   String
  createdAt  DateTime           @default(now())

  couple Couple @relation(fields: [coupleId], references: [id], onDelete: Cascade)
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, targetType, targetId])
  @@index([coupleId, targetType])
}
```

Notas sobre decisiones de esquema: `Person` y `Location` son entidades propias en vez de campos de texto libre porque el brief pide poder filtrar el buscador por lugar y ver quién aparece en un recuerdo — eso exige que sean reutilizables y consultables, no strings sueltos repetidos. `MemorySong` usa una clave compuesta con `role` porque un mismo recuerdo puede tener a la vez una "canción favorita" y una "música del momento" distintas. `Favorite` es polimórfico para no cuadruplicar tablas casi idénticas. Todo lo que un usuario puede "eliminar" desde la UI (`Memory`, `Album`, `Letter`) tiene `deletedAt` para soportar la papelera de 30 días en vez de un `DELETE` irreversible. Cada tabla de tenant indexa `coupleId` como primer campo de sus índices compuestos porque será el filtro presente en el 100% de las consultas.

### 4.3 Row Level Security

Sobre esta base, cada tabla de tenant lleva una política equivalente a `USING (couple_id = (auth.jwt() ->> 'couple_id')::uuid)`, con el claim `couple_id` inyectado al JWT mediante un Auth Hook de Supabase al momento del login. Esto se implementa en una migración SQL separada del `schema.prisma` (Prisma no gestiona RLS nativamente), documentada en `supabase/migrations/`.

---

## 5. Sistema de componentes

Los componentes se organizan en tres niveles, sin caer en la rigidez de atomic design completo (que para una app de este tamaño añade más ceremonia que valor).

**Primitivos** son la capa de `shadcn/ui` ya estilizada con los tokens del Design System — `Button`, `Input`, `Dialog`, `Popover`, `Tooltip`, `Command` (para el buscador global), `Skeleton`. Viven en `shared/components/ui/` y no conocen nada del dominio.

**Compuestos** son los componentes de negocio construidos sobre los primitivos: `MemoryCard` (la tarjeta que aparece en carruseles y grillas, con la animación de hover elegante — escala sutil, sombra que se eleva, fecha y ubicación que aparecen), `HorizontalCarousel` (con scroll-snap, flechas, soporte de teclado y arrastre), `Hero` (imagen destacada, frase, fecha, CTA "Revivir este momento"), `AlbumCard`, `TimelineNode` y `TimelineAxis`, `LetterEditor` (envuelve un editor Markdown enriquecido), `ImageLightbox` (visor inmersivo con gestos), `MusicPickerSpotify`, `CalendarGrid`, `SearchCommandPalette`, y los `DashboardWidget` (uno por métrica: días juntos, próximo aniversario, recuerdo aleatorio, etc., todos implementando la misma interfaz de props para que el dashboard los renderice de forma genérica).

**De layout** son los que definen la estructura de página: `Navbar` (transparente sobre el hero, sólida al hacer scroll), `Sidebar`/`BottomNav` (sidebar en desktop, barra inferior en móvil), `PageContainer`, y los estados universales que todo listado necesita — `EmptyState`, `ErrorBoundary`, `LoadingSkeleton` (una variante por tipo de tarjeta para que el skeleton tenga la silueta correcta), y `Toaster` (usando `sonner`, ya integrado con shadcn).

Un detalle técnico que vale la pena señalar ahora: la vista de detalle de un recuerdo (`/moments/[id]`) se implementa con **intercepting + parallel routes** de Next.js App Router. Al hacer clic en una tarjeta desde un carrusel, la vista de detalle se abre como modal superpuesto (con `layoutId` de Framer Motion animando la transición tarjeta → modal), pero la URL cambia de verdad a `/moments/[id]`, así que el recuerdo es compartible y recargable como página completa. Es el mismo patrón que usan Instagram y Linear para sus vistas de detalle, y encaja perfectamente con la inspiración de Netflix que pediste sin copiar su interfaz literal.

---

## 6. Sistema de navegación

### 6.1 Mapa de rutas

```
/                              landing pública (no autenticado)
/login, /signup
/invite/[code]                 flujo de emparejamiento de pareja

(app)/                         layout autenticado con Navbar + Sidebar
  /dashboard
  /moments                     grid + carruseles ("Nuestros Momentos")
  /moments/[memoryId]          vista inmersiva completa
  /moments/@modal/[memoryId]   intercepting route (modal desde carrusel)
  /albums
  /albums/[albumId]
  /timeline
  /letters
  /letters/new
  /letters/[letterId]
  /calendar
  /favorites
  /search                      además disponible como command palette global (⌘K)
  /settings/profile
  /settings/couple
  /settings/notifications
```

### 6.2 Filosofía de navegación

Tomamos de Netflix la sensación (hero grande, carruseles horizontales con snap, tarjetas que reaccionan al hover, navegación por categorías) pero no la jerarquía visual densa ni la saturación de contenido por pantalla — Invisible String necesita respirar, así que hay menos carruseles visibles a la vez, más espacio en blanco entre secciones, y el hover es una elevación suave con sombra en vez del "preview que crece y reproduce video" de Netflix. La barra de navegación es transparente sobre el hero de inicio y se vuelve sólida con un desenfoque sutil (glassmorphism) al hacer scroll, tomando ahí sí una idea directa de Apple. El buscador global vive tanto como página propia como command palette (⌘K / Ctrl+K) accesible desde cualquier pantalla, inspirado en Linear.

---

## 7. Design System

### 7.1 Paleta de color

La paleta pastel que pediste tiene un riesgo real de accesibilidad si se usa mal: texto en tonos pastel sobre blanco casi nunca alcanza el contraste mínimo de WCAG AA (4.5:1). La resolución es simple pero hay que aplicarla con disciplina en todo el proyecto: los pastel se usan como **fondos de bloques y acentos decorativos**, nunca como color de texto sobre blanco; el texto siempre corre en un carbón cálido, no negro puro, para mantener la calidez de la marca.

| Token | Hex | Uso |
|---|---|---|
| `background` | `#FFFFFF` | fondo base |
| `background-cream` | `#FAF6F0` | fondo alterno de secciones |
| `foreground` | `#2E2A2C` | texto principal (carbón cálido, no negro puro) |
| `foreground-muted` | `#6B6468` | texto secundario |
| `pink-pastel` | `#F7D9E3` | fondos, badges, acentos |
| `pink-accent` | `#E88BAA` | botones/estados activos sobre fondo claro (cumple contraste con texto blanco) |
| `lavender-pastel` | `#E4D9F7` | fondos, badges |
| `lavender-accent` | `#9B7FD1` | acentos activos |
| `sky-pastel` | `#D9EFF7` | fondos, badges |
| `sky-accent` | `#6FB3CC` | acentos activos |
| `beige` | `#EDE3D9` | fondos neutros, bordes |
| `cream` | `#FFF9F2` | tarjetas elevadas |

Para el modo nocturno ("Bajo las estrellas"), el fondo base pasa a `#1B1A2E` (índigo profundo), las tarjetas a `#252340`, y los acentos pastel se reemplazan por sus versiones desaturadas y más luminosas para mantener contraste (`#F0B8CE`, `#C9AEEF`, `#A9DCEE`) sobre texto claro `#F5F1EC`.

### 7.2 Tipografía

Inter para toda la interfaz (labels, cuerpo, navegación) por su legibilidad a tamaños pequeños; Geist para titulares y momentos de mayor jerarquía (nombre de la app, frases del hero, títulos de sección) por su carácter más geométrico y premium. Como mejora opcional — no obligatoria — propongo reservar una fuente serif suave (por ejemplo Fraunces) exclusivamente para la frase destacada del Hero y las citas dentro de una carta abierta, como único momento "caligráfico" de la app; se puede descartar sin afectar nada más del sistema.

### 7.3 Forma, sombra y profundidad

Radios de `1rem` (`rounded-2xl`) como estándar en tarjetas y controles, `1.5rem` (`rounded-3xl`) en superficies grandes como el Hero y los modales. Sombras suaves de dos capas (una ambiental de bajo blur, una de contacto más definida) en vez de una sola sombra dura. El glassmorphism se aplica con moderación: `backdrop-blur-md` con `bg-white/60` y borde `border-white/40`, reservado para la navbar al hacer scroll y para overlays sobre imágenes — nunca como fondo de página completa, que cansaría la vista rápido.

### 7.4 Movimiento

Duraciones estándar de 150ms (microinteracciones, hover), 250ms (transiciones de componente) y 400–600ms (transiciones de página, shared layout). Easing propio suave (`cubic-bezier(0.22, 1, 0.36, 1)`) en vez de los easings por defecto de Framer Motion, para que el movimiento se sienta "amortiguado" y no mecánico. Todo componente animado debe envolver su animación con un chequeo de `prefers-reduced-motion` a nivel de hook compartido (`useReducedMotionSafe`), de forma que quien lo necesite reciba transiciones instantáneas sin perder funcionalidad.

---

## 8. Estructura de carpetas

```
invisible-string/
├── prisma/
│   └── schema.prisma
├── supabase/
│   └── migrations/              # RLS policies, auth hooks
├── src/
│   ├── app/                     # Next.js App Router — solo routing + composición
│   │   ├── (marketing)/
│   │   │   ├── page.tsx
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── invite/[code]/
│   │   └── (app)/
│   │       ├── layout.tsx
│   │       ├── dashboard/
│   │       ├── moments/
│   │       │   ├── page.tsx
│   │       │   ├── [memoryId]/page.tsx
│   │       │   └── @modal/(.)[memoryId]/page.tsx
│   │       ├── albums/
│   │       ├── timeline/
│   │       ├── letters/
│   │       ├── calendar/
│   │       ├── favorites/
│   │       ├── search/
│   │       └── settings/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── memories/
│   │   │   ├── domain/          # entities, value objects, repository interfaces
│   │   │   ├── application/     # use-cases (createMemory, replayMemory...)
│   │   │   ├── infrastructure/  # PrismaMemoryRepository, SupabaseStorageAdapter
│   │   │   └── presentation/
│   │   │       ├── components/  # MemoryCard, MemoryDetailView, ReplayExperience
│   │   │       ├── hooks/       # useMemories, useCreateMemory
│   │   │       └── actions/     # server actions
│   │   ├── albums/          (misma estructura de 4 capas)
│   │   ├── timeline/
│   │   ├── letters/
│   │   ├── calendar/
│   │   ├── favorites/
│   │   ├── music/
│   │   ├── search/
│   │   ├── dashboard/
│   │   └── profile/
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/               # shadcn primitives ya estilizados
│   │   │   └── layout/           # Navbar, Sidebar, PageContainer, EmptyState...
│   │   ├── hooks/
│   │   ├── lib/                  # prisma client, supabase client, query-client
│   │   ├── services/              # cross-feature: notifications, email
│   │   ├── utils/
│   │   ├── types/
│   │   └── styles/                # tailwind config, tokens, globals.css
│   │
│   └── middleware.ts              # auth guard, couple_id claim check
│
├── tests/
│   ├── unit/
│   ├── e2e/
├── .github/workflows/
├── docs/
│   └── ARCHITECTURE.md            # este documento
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

Cada feature es, en la práctica, removible: si mañana decidimos que "Música" no vale la pena, se borra la carpeta `features/music/` y el resto del sistema sigue compilando (con la única excepción de las referencias explícitas desde otras features, que deben ser mínimas y siempre a través de tipos compartidos en `shared/types/`, nunca importando el `domain` de una feature desde otra).

---

## 9. Roadmap de desarrollo por fases

**Fase 0 — Fundaciones (repo, auth, base de datos).** Inicializar el repo con la estructura definida, configurar Tailwind con los tokens del Design System, levantar Prisma + migraciones + RLS, implementar auth con Supabase (login, signup, y el flujo de invitación/emparejamiento de pareja), layout base autenticado con Navbar y Sidebar vacíos, y el pipeline de CI (typecheck, lint, build) en GitHub Actions. Al final de esta fase, dos personas se pueden registrar, emparejarse, y ver un dashboard vacío — sin ninguna animación todavía.

**Fase 1 — MVP funcional: Momentos y Álbumes.** CRUD completo de recuerdos (formulario con React Hook Form + Zod, subida de imágenes a Supabase Storage con optimización), CRUD de álbumes con reordenamiento por arrastre, vista de grid simple de recuerdos, dashboard con los widgets básicos (días juntos, último recuerdo). Sin carruseles Netflix-style ni modo inmersivo todavía — el objetivo es que el dato fluya correctamente de principio a fin.

**Fase 2 — La experiencia inmersiva.** Aquí entra el trabajo de identidad: Hero animado en Inicio, carruseles horizontales por categoría, `MemoryCard` con las microinteracciones de hover, la vista de detalle con intercepting routes y shared layout animations, y el modo "Revivir este momento" con el slideshow cinematográfico. Es la fase donde el producto empieza a sentirse como lo describiste, no solo a funcionar.

**Fase 3 — Timeline y Cartas.** Línea del tiempo visual organizada por año/mes/evento con animaciones de scroll, y el módulo completo de cartas: editor enriquecido con Markdown, programación de fecha de apertura, estado leído/no leído, archivado, y las notificaciones (email) que avisan cuando una carta se desbloquea.

**Fase 4 — Música, Calendario, Favoritos, Buscador global.** Integración con la API de Spotify para vincular canciones a recuerdos (favorita, playlist, música del momento), calendario visual con cumpleaños/aniversarios/viajes y cuentas regresivas, sistema de favoritos transversal, y el buscador global (página + command palette) con filtros por fecha, álbum, lugar, etiqueta, emoción y texto.

**Fase 5 — Pulido y diferenciadores.** Modo nocturno completo, PWA instalable con caché offline básico, "Un día como hoy", mapa de recuerdos, notas de voz, exportación a PDF, auditoría de accesibilidad (contraste, `prefers-reduced-motion`, navegación por teclado completa) y auditoría de rendimiento (Lighthouse, Core Web Vitals).

**Fase 6 — Hardening de producción.** Suite de tests (unit con Vitest, e2e con Playwright sobre los flujos críticos: crear recuerdo, programar carta, emparejamiento), Sentry para tracking de errores, rate limiting en Server Actions sensibles, revisión final de políticas RLS, y despliegue de producción en Vercel con preview deployments conectados al repo.

Cada fase termina en un estado desplegable y demostrable — no hay una fase de "integración final" al estilo cascada. Cuando apruebes este documento, la implementación arranca en la Fase 0, módulo por módulo, y te voy entregando avances revisables en vez de todo junto al final.

---

## 10. Siguiente paso

Este documento cubre los puntos 1 a 9 de la metodología que definiste. Falta confirmar la URL del repositorio de GitHub existente para empezar a trabajar sobre él en la Fase 0. Todo lo demás — paleta, arquitectura, esquema de base de datos, roadmap — está listo para tu revisión y ajustes antes de que se escriba la primera línea de código de producto.
