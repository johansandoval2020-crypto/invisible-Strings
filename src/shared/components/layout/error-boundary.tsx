"use client";

import * as React from "react";
import { HeartCrack } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (reset: () => void) => React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Error boundary genérico de UI. Next.js ya provee error.tsx por segmento
 * de ruta para errores de render en Server/Client Components; este
 * boundary se usa dentro de una página para aislar un widget o sección
 * puntual (p.ej. un carrusel) sin tumbar el resto de la pantalla.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[ErrorBoundary]", error);
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback(this.reset);
      return (
        <div className="border-border bg-background-cream/60 flex flex-col items-center gap-3 rounded-3xl border px-8 py-12 text-center">
          <HeartCrack className="text-muted-foreground size-6" />
          <p className="text-muted-foreground text-sm">
            Algo no salió como esperábamos acá.
          </p>
          <Button variant="outline" size="sm" onClick={this.reset}>
            Reintentar
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
