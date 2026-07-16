import { create } from "zustand";

interface UIState {
  isSearchOpen: boolean;
  isMobileNavOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setMobileNavOpen: (open: boolean) => void;
}

/**
 * Estado de interfaz puro (nada que venga del servidor vive acá).
 * Ver docs/ARCHITECTURE.md §3.3 — Zustand se reserva para esto:
 * modales, filtros de UI, y estado efímero como este.
 */
export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  isMobileNavOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
}));
