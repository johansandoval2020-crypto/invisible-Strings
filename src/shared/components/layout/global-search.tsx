"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Images, FolderHeart, Mail, CalendarHeart } from "lucide-react";

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/shared/components/ui/command";
import { useUIStore } from "@/shared/stores/use-ui-store";

/**
 * Command palette global (⌘K / Ctrl+K). En Fase 0 solo resuelve
 * navegación a secciones; la búsqueda real sobre recuerdos/álbumes/
 * cartas/canciones se conecta en la Fase 4 vía TanStack Query.
 */
export function GlobalSearch() {
  const router = useRouter();
  const { isSearchOpen, setSearchOpen } = useUIStore();

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  function go(href: string) {
    setSearchOpen(false);
    router.push(href);
  }

  return (
    <CommandDialog
      open={isSearchOpen}
      onOpenChange={setSearchOpen}
      title="Buscador global"
    >
      <CommandInput placeholder="Busca por fecha, álbum, lugar, etiqueta o emoción…" />
      <CommandList>
        <CommandEmpty>No encontramos nada con eso, todavía.</CommandEmpty>
        <CommandGroup heading="Ir a">
          <CommandItem onSelect={() => go("/moments")}>
            <Images />
            Nuestros Momentos
          </CommandItem>
          <CommandItem onSelect={() => go("/albums")}>
            <FolderHeart />
            Álbumes
          </CommandItem>
          <CommandItem onSelect={() => go("/letters")}>
            <Mail />
            Cartas
          </CommandItem>
          <CommandItem onSelect={() => go("/calendar")}>
            <CalendarHeart />
            Calendario
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
