"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { Moon, Sun, LogOut } from "lucide-react";
import { MODULOS, ROL_LABEL, type ModuloSlug } from "@/lib/roles";
import type { Rol } from "@prisma/client";

export function Header({ nombre, rol }: { nombre: string; rol: Rol }) {
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();

  const slug = pathname.split("/")[1] as ModuloSlug | undefined;
  const title = slug && MODULOS[slug] ? MODULOS[slug].label : "Celedi Maquinaria";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted transition hover:text-foreground"
          aria-label="Cambiar tema"
        >
          {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="text-right">
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
