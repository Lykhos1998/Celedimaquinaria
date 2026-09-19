"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Megaphone,
  Handshake,
  Wrench,
  ShoppingCart,
  Hammer,
  Wallet,
  Truck,
  Users,
  Forklift,
  Monitor,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import type { ModuloSlug } from "@/lib/roles";
import { MODULOS } from "@/lib/roles";

const ICONS: Record<ModuloSlug, LucideIcon> = {
  vigilancia: ShieldCheck,
  marketing: Megaphone,
  ventas: Handshake,
  danos: Wrench,
  compras: ShoppingCart,
  taller: Hammer,
  finanzas: Wallet,
  logistica: Truck,
  rh: Users,
  equipos: Forklift,
  "sistemas-ti": Monitor,
  gerencia: LayoutDashboard,
};

export function Sidebar({ modulos }: { modulos: ModuloSlug[] }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-active text-sm font-bold text-white">
          CM
        </div>
        <span className="text-sm font-semibold">Celedi Maquinaria</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {modulos.map((slug) => {
          const Icon = ICONS[slug];
          const href = `/${slug}`;
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={slug}
              href={href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                active
                  ? "bg-sidebar-active text-white"
                  : "text-sidebar-muted hover:bg-white/5 hover:text-sidebar-foreground"
              }`}
            >
              <Icon size={17} />
              {MODULOS[slug].label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-4 py-3 text-xs text-sidebar-muted">
        Especificación funcional · v. inicial
      </div>
    </aside>
  );
}
