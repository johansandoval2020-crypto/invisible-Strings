"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useUIStore } from "@/shared/stores/use-ui-store";

/**
 * Navbar del área autenticada: transparente sobre el Hero de /dashboard,
 * y sólida con glassmorphism sutil al hacer scroll (ver §6.2 del doc de
 * arquitectura — es la idea que tomamos de Apple, no de Netflix).
 */
export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { scrollY } = useScroll();
  const { setSearchOpen, setMobileNavOpen } = useUIStore();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 24);
  });

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center justify-between px-6 transition-colors duration-300 md:px-10",
        isScrolled ? "glass shadow-[var(--shadow-soft)]" : "bg-transparent",
      )}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Abrir menú"
        >
          <Menu />
        </Button>
        <Link href="/dashboard" className="font-display text-base font-medium">
          Invisible String
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchOpen(true)}
          aria-label="Buscar (⌘K)"
        >
          <Search />
        </Button>
        <Link href="/settings/profile" aria-label="Tu perfil">
          <Avatar>
            <AvatarFallback>IS</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </motion.header>
  );
}
