"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib/utils";
import { NAV_ITEMS } from "@/shared/config/navigation";

/**
 * Sidebar fija de escritorio. En mobile se reemplaza por BottomNav +
 * el Sheet que abre el botón de menú del Navbar (ver mobile-nav.tsx).
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-border sticky top-16 hidden h-[calc(100dvh-4rem)] w-60 shrink-0 flex-col gap-1 overflow-y-auto border-r px-4 py-6 md:flex">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-lavender-pastel text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="size-4.5" />
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
