"use client";

import { useActionState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  createCoupleAction,
  type CoupleActionResult,
} from "@/features/profile/presentation/actions/couple-actions";

const initialState: CoupleActionResult = {};

export function CreateCoupleForm() {
  const [state, formAction, isPending] = useActionState(
    createCoupleAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="relationshipStartDate">¿Cuándo empezaron su relación?</Label>
        <Input
          id="relationshipStartDate"
          name="relationshipStartDate"
          type="date"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="anniversaryDate">Fecha de aniversario (opcional)</Label>
        <Input id="anniversaryDate" name="anniversaryDate" type="date" />
      </div>

      {state.error && (
        <p className="text-destructive text-sm" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="mt-2">
        {isPending ? "Creando…" : "Crear nuestro espacio"}
      </Button>
    </form>
  );
}
