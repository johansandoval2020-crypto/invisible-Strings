import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind de forma segura, resolviendo conflictos
 * (p.ej. "p-2" vs "p-4") a favor de la última clase declarada.
 * Usado por todos los primitivos de UI en shared/components/ui.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
