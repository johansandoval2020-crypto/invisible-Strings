import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Estado vacío universal — todo listado (recuerdos, álbumes, cartas,
 * favoritos, resultados de búsqueda) debe usar este componente en vez
 * de improvisar un mensaje suelto, para que la voz de la app sea
 * consistente incluso cuando no hay nada que mostrar todavía.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border bg-background-cream/60 flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed px-8 py-16 text-center",
        className,
      )}
    >
      <div className="bg-lavender-pastel flex size-12 items-center justify-center rounded-full">
        <Icon className="text-lavender-accent size-5" />
      </div>
      <h3 className="font-display text-foreground text-lg font-medium">{title}</h3>
      {description && (
        <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
