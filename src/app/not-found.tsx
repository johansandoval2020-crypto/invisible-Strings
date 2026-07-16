import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <Compass className="text-muted-foreground size-8" />
      <h1 className="font-display text-xl font-medium">No encontramos este recuerdo</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        El enlace puede estar roto o la página ya no existe.
      </p>
      <Button asChild>
        <Link href="/dashboard">Volver al inicio</Link>
      </Button>
    </div>
  );
}
