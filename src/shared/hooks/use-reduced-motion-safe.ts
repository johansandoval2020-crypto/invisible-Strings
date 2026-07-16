"use client";

import { useReducedMotion } from "framer-motion";

/**
 * Wrapper sobre useReducedMotion de Framer Motion con una API pensada
 * para variants: devuelve duraciones/transiciones neutras cuando el
 * usuario prefiere movimiento reducido, en vez de tener que ramificar
 * cada componente animado a mano.
 *
 * Ver docs/ARCHITECTURE.md §7.4 — todo componente animado debe pasar
 * por este hook antes de definir sus `transition`.
 */
export function useReducedMotionSafe() {
  const prefersReducedMotion = useReducedMotion();

  return {
    prefersReducedMotion: Boolean(prefersReducedMotion),
    transition: (normal: object) =>
      prefersReducedMotion ? { duration: 0.01 } : normal,
  };
}
