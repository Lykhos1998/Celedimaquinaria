"use client";

import { useTransition } from "react";
import { cambiarActivoCamion } from "@/app/(app)/logistica/actions";

export type CamionRow = {
  id: string;
  placa: string;
  modelo: string | null;
  capacidad: string | null;
  activo: boolean;
  trasladosEnCurso: number;
};

export function CamionesTable({ camiones }: { camiones: CamionRow[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold text-foreground">Flotilla</h3>
      </div>
      {camiones.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">Sin camiones registrados.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th className="px-5 py-2 font-medium">Placa</th>
              <th className="px-5 py-2 font-medium">Modelo</th>
              <th className="px-5 py-2 font-medium">Capacidad</th>
              <th className="px-5 py-2 font-medium">Traslados activos</th>
              <th className="px-5 py-2 font-medium">Estado</th>
              <th className="px-5 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {camiones.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-5 py-2 font-mono text-xs text-foreground">{c.placa}</td>
                <td className="px-5 py-2 text-muted">{c.modelo ?? "—"}</td>
                <td className="px-5 py-2 text-muted">{c.capacidad ?? "—"}</td>
                <td className="px-5 py-2 text-muted">{c.trasladosEnCurso}</td>
                <td className="px-5 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.activo ? "bg-emerald-500/15 text-emerald-500" : "bg-slate-500/15 text-slate-400"
                    }`}
                  >
                    {c.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-5 py-2 text-right">
                  <button
                    disabled={pending}
                    onClick={() => startTransition(() => cambiarActivoCamion(c.id, !c.activo))}
                    className="rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground transition hover:border-brand hover:text-brand disabled:opacity-50"
                  >
                    {c.activo ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
