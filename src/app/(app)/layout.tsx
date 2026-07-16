import { Navbar } from "@/shared/components/layout/navbar";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { BottomNav } from "@/shared/components/layout/bottom-nav";
import { MobileNavSheet } from "@/shared/components/layout/mobile-nav-sheet";
import { GlobalSearch } from "@/shared/components/layout/global-search";

/**
 * Layout del área autenticada. La verificación de sesión ya la hace
 * src/middleware.ts (redirige a /login si no hay usuario); acá, más
 * adelante en la Fase 0, se agrega además el chequeo de "¿el usuario ya
 * tiene coupleId?" para forzar el flujo de /invite/[code] si todavía no
 * se emparejó con su pareja.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <BottomNav />
      <MobileNavSheet />
      <GlobalSearch />
    </div>
  );
}
