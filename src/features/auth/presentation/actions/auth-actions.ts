"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/shared/lib/supabase/server";
import { prisma } from "@/shared/lib/prisma";
import { loginSchema, signupSchema } from "@/features/auth/application/schemas";

export interface AuthActionResult {
  error?: string;
}

/**
 * Solo permite redirects relativos dentro de la propia app (p.ej. volver a
 * /invite/[code] después de loguearse) — nunca a una URL externa, para no
 * abrir una puerta de open-redirect a través del parámetro `redirect`.
 */
function safeRedirectTarget(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  return value.startsWith("/") && !value.startsWith("//") ? value : null;
}

/**
 * Server Action de login. Es el adaptador entre presentation e
 * infrastructure (Supabase Auth) — valida con Zod antes de tocar la red,
 * y nunca expone el cliente de Supabase directamente al componente.
 */
export async function loginAction(
  _prev: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "Correo o contraseña incorrectos" };
  }

  redirect(safeRedirectTarget(formData.get("redirect")) ?? "/dashboard");
}

export async function signupAction(
  _prev: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  const parsed = signupSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { display_name: parsed.data.displayName } },
  });

  if (error || !data.user) {
    return { error: "No pudimos crear tu cuenta. Probá con otro correo." };
  }

  // Supabase Auth solo administra credenciales — la fila de negocio en
  // `users` (la que tiene coupleId, displayName, etc.) la creamos acá,
  // usando el mismo id que le asignó Supabase para que ambas tablas
  // queden alineadas 1:1. Ver docs/ARCHITECTURE.md §4.
  await prisma.user.create({
    data: {
      id: data.user.id,
      email: parsed.data.email,
      displayName: parsed.data.displayName,
    },
  });

  redirect(safeRedirectTarget(formData.get("redirect")) ?? "/settings/couple");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
