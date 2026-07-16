"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib/utils";
import { NAV_ITEMS } from "@/shared/config/navigation";

/**
 * Navegación inferior de mobile — muestra los 5 items más usados;
 * el resto vive en el Sheet del botón de menú del Navbar.
 */
export function BottomNav() {
  const pathname = usePathname();
  const items = NAV_ITEMS.slice(0, 5);

  return (
    <nav className="glass border-border sticky bottom-0 z-40 flex items-center justify-around border-t px-2 py-2 md:hidden">
      {items.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors",
              isActive ? "text-lavender-accent" : "text-muted-foreground",
            )}
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
