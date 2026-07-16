import { cache } from "react";

import { createClient } from "@/shared/lib/supabase/server";
import { prisma } from "@/shared/lib/prisma";

/**
 * Resuelve el usuario de la sesión actual (Supabase Auth) contra su fila
 * en Prisma. `cache()` de React deduplica esto dentro de un mismo request
 * — varios Server Components pueden llamarlo sin disparar N consultas.
 *
 * Devuelve null si no hay sesión. No redirige acá — cada caller decide
 * qué hacer (el middleware ya cubre el caso general de "ruta protegida
 * sin sesión"; este helper cubre el caso más fino de "¿ya tiene pareja?").
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  return prisma.user.findUnique({ where: { id: authUser.id } });
});

/**
 * Devuelve el coupleId del usuario actual, o redirige si falta un
 * requisito (sin sesión → /login, sin pareja emparejada → /settings/couple).
 * Es el guard que usan todos los Server Components/Actions de memories,
 * albums, dashboard, etc. — nada de eso tiene sentido sin un coupleId.
 */
export async function requireCoupleId(): Promise<string> {
  const { redirect } = await import("next/navigation");
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (!user.coupleId) redirect("/settings/couple");

  return user.coupleId;
}
