"use client";

import { useActionState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  joinCoupleAction,
  type CoupleActionResult,
} from "@/features/profile/presentation/actions/couple-actions";

const initialState: CoupleActionResult = {};

export function JoinCoupleForm({ inviteCode }: { inviteCode?: string }) {
  const [state, formAction, isPending] = useActionState(joinCoupleAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="inviteCode">Código de invitación</Label>
        <Input
          id="inviteCode"
          name="inviteCode"
          defaultValue={inviteCode}
          placeholder="Pegá el código que te compartieron"
          required
        />
      </div>

      {state.error && (
        <p className="text-destructive text-sm" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="mt-2">
        {isPending ? "Uniéndote…" : "Unirme"}
      </Button>
    </form>
  );
}
