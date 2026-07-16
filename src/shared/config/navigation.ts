import {
  LayoutDashboard,
  Images,
  FolderHeart,
  History,
  Mail,
  CalendarHeart,
  Star,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/**
 * Fuente única de verdad para los items de navegación — Sidebar (desktop)
 * y BottomNav (mobile) leen de acá para no duplicar la lista en dos
 * componentes que inevitablemente se desincronizan.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: "Inicio", href: "/dashboard", icon: LayoutDashboard },
  { label: "Momentos", href: "/moments", icon: Images },
  { label: "Álbumes", href: "/albums", icon: FolderHeart },
  { label: "Línea del tiempo", href: "/timeline", icon: History },
  { label: "Cartas", href: "/letters", icon: Mail },
  { label: "Calendario", href: "/calendar", icon: CalendarHeart },
  { label: "Favoritos", href: "/favorites", icon: Star },
];
