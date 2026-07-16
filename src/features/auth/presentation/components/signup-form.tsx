"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  signupAction,
  type AuthActionResult,
} from "@/features/auth/presentation/actions/auth-actions";

const initialState: AuthActionResult = {};

export function SignupForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, isPending] = useActionState(signupAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="displayName">Tu nombre</Label>
        <Input id="displayName" name="displayName" autoComplete="name" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Correo</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>

      {state.error && (
        <p className="text-destructive text-sm" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="mt-2">
        {isPending ? "Creando cuenta…" : "Crear cuenta"}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        ¿Ya tenés cuenta?{" "}
        <Link
          href={
            redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login"
          }
          className="text-foreground font-medium underline underline-offset-4"
        >
          Entrá
        </Link>
      </p>
    </form>
  );
}
