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
  UserCircle,
  X,
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

export function Sidebar({
  modulos,
  open,
  onClose,
}: {
  modulos: ModuloSlug[];
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const miCuentaActiva = pathname === "/mi-cuenta" || pathname.startsWith("/mi-cuenta/");

  return (
    <>
      {/* Fondo oscuro solo en móvil, para cerrar el panel al tocar afuera */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-5 py-5">
          {/* eslint-disable-next-line @next/next/no-img-element -- logo estático, no necesita el pipeline de optimización de next/image */}
          <img src="/brand/celedi-logo.png" alt="Celedi Maquinaria" className="h-auto w-32" />
          <button
            onClick={onClose}
            className="text-sidebar-muted transition hover:text-sidebar-foreground lg:hidden"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
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
                onClick={onClose}
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

        <div className="border-t border-white/10 px-3 py-2">
          <Link
            href="/mi-cuenta"
            onClick={onClose}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
              miCuentaActiva
                ? "bg-sidebar-active text-white"
                : "text-sidebar-muted hover:bg-white/5 hover:text-sidebar-foreground"
            }`}
          >
            <UserCircle size={17} />
            Mi cuenta
          </Link>
        </div>

        <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3 text-xs text-sidebar-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- logo estático chico, no necesita el pipeline de optimización de next/image */}
          <img src="/brand/lykhos-logo.png" alt="" className="h-4 w-4 opacity-70" />
          Desarrollado por <span className="font-semibold text-sidebar-foreground">Lykhos</span>
        </div>
      </aside>
    </>
  );
}
