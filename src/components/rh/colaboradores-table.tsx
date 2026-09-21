"use client";

import { useTransition } from "react";
import { toggleActivoColaborador } from "@/app/(app)/rh/actions";
import { ROL_LABEL } from "@/lib/roles";
import { formatFechaHora } from "@/lib/format";
import type { Rol } from "@prisma/client";

export type ColaboradorRow = {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  activo: boolean;
  createdAt: Date;
};

export function ColaboradoresTable({ colaboradores }: { colaboradores: ColaboradorRow[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold text-foreground">Colaboradores</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th className="px-5 py-2 font-medium">Nombre</th>
              <th className="px-5 py-2 font-medium">Correo</th>
              <th className="px-5 py-2 font-medium">Rol</th>
              <th className="px-5 py-2 font-medium">Alta</th>
              <th className="px-5 py-2 font-medium">Estado</th>
              <th className="px-5 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {colaboradores.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-5 py-2 text-foreground">{c.nombre}</td>
                <td className="px-5 py-2 text-muted">{c.email}</td>
                <td className="px-5 py-2 text-muted">{ROL_LABEL[c.rol]}</td>
                <td className="px-5 py-2 text-muted">{formatFechaHora(c.createdAt)}</td>
                <td className="px-5 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.activo ? "bg-emerald-500/15 text-emerald-500" : "bg-red-500/15 text-red-500"
                    }`}
                  >
                    {c.activo ? "Activo" : "Baja"}
                  </span>
                </td>
                <td className="px-5 py-2 text-right">
                  <button
                    disabled={pending}
                    onClick={() => startTransition(() => toggleActivoColaborador(c.id, !c.activo))}
                    className="rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground transition hover:border-brand hover:text-brand disabled:opacity-50"
                  >
                    {c.activo ? "Dar de baja" : "Reactivar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
