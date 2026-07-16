"use client";

import { useEffect } from "react";
import { HeartCrack } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <HeartCrack className="text-muted-foreground size-8" />
      <h1 className="font-display text-xl font-medium">
        Algo se rompió de nuestro lado
      </h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        Ya quedó registrado. Podés intentar de nuevo.
      </p>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  );
}
