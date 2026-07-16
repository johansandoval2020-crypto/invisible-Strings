import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

/**
 * Landing pública. El Hero real (imagen destacada + frase + fecha +
 * "Revivir este momento") vive dentro de (app)/dashboard una vez hay
 * sesión — esta página es la puerta de entrada para quien todavía no
 * tiene cuenta.
 */
export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <span className="bg-lavender-pastel text-foreground rounded-full px-4 py-1.5 text-xs font-medium">
        Un hilo invisible los une, incluso en la distancia
      </span>
      <h1 className="font-display text-foreground max-w-2xl text-4xl leading-tight font-medium md:text-5xl">
        Guarden, organicen y revivan los recuerdos que construyen juntos
      </h1>
      <p className="text-muted-foreground max-w-lg text-base">
        Invisible String es un espacio privado para su historia como pareja — no una
        galería, un lugar para volver a sentir cada momento.
      </p>
      <div className="mt-2 flex items-center gap-3">
        <Button asChild size="lg">
          <Link href="/signup">Crear nuestro espacio</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/login">Ya tengo cuenta</Link>
        </Button>
      </div>
    </div>
  );
}
