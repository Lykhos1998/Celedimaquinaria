"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { Moon, Sun, LogOut, Menu } from "lucide-react";
import { MODULOS, ROL_LABEL, type ModuloSlug } from "@/lib/roles";
import type { Rol } from "@prisma/client";

export function Header({
  nombre,
  rol,
  onMenuClick,
}: {
  nombre: string;
  rol: Rol;
  onMenuClick: () => void;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // El tema real solo se conoce tras montar (next-themes lo resuelve del
  // localStorage vía script inyectado); hasta entonces mostramos un ícono
  // fijo para que el HTML del servidor y el primer render del cliente
  // coincidan y no se dispare una re-hidratación.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- ver comentario arriba
    setMounted(true);
  }, []);

  const slug = pathname.split("/")[1] as ModuloSlug | undefined;
  const title = slug && MODULOS[slug] ? MODULOS[slug].label : "Celedi Maquinaria";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-muted transition hover:text-foreground lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={18} />
        </button>
        <h1 className="truncate text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted transition hover:text-foreground"
          aria-label="Cambiar tema"
        >
          {mounted && resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-foreground">{nombre}</p>
          <p className="text-xs text-muted">{ROL_LABEL[rol]}</p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted transition hover:text-foreground"
          aria-label="Cerrar sesión"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
