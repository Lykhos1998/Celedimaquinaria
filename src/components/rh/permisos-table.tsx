"use client";

import { useTransition } from "react";
import { resolverPermiso } from "@/app/(app)/rh/actions";
import { TIPO_PERMISO_LABEL, ESTADO_PERMISO_LABEL, ESTADO_PERMISO_STYLE } from "@/lib/rh";
import { formatFechaHora } from "@/lib/format";
import type { TipoPermiso, EstadoPermiso } from "@prisma/client";

export type PermisoRow = {
  id: string;
  folio: string;
  tipo: TipoPermiso;
  fechaInicio: Date;
  fechaFin: Date;
  motivo: string | null;
  estado: EstadoPermiso;
  colaboradorId: string;
  colaborador: { nombre: string };
  resueltoPor: { nombre: string } | null;
};

export function PermisosTable({ permisos, sessionUserId }: { permisos: PermisoRow[]; sessionUserId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold text-foreground">Solicitudes</h3>
      </div>
      {permisos.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">Sin solicitudes registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium">Folio</th>
                <th className="px-5 py-2 font-medium">Colaborador</th>
                <th className="px-5 py-2 font-medium">Tipo</th>
                <th className="px-5 py-2 font-medium">Desde</th>
                <th className="px-5 py-2 font-medium">Hasta</th>
                <th className="px-5 py-2 font-medium">Estado</th>
                <th className="px-5 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {permisos.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-5 py-2 font-mono text-xs text-foreground">{p.folio}</td>
                  <td className="px-5 py-2 text-foreground">
                    {p.colaborador.nombre}
                    {p.motivo && <p className="text-xs text-muted">{p.motivo}</p>}
                  </td>
                  <td className="px-5 py-2 text-muted">{TIPO_PERMISO_LABEL[p.tipo]}</td>
                  <td className="px-5 py-2 text-muted">{formatFechaHora(p.fechaInicio)}</td>
                  <td className="px-5 py-2 text-muted">{formatFechaHora(p.fechaFin)}</td>
                  <td className="px-5 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_PERMISO_STYLE[p.estado]}`}>
                      {ESTADO_PERMISO_LABEL[p.estado]}
                    </span>
                    {p.resueltoPor && <p className="mt-0.5 text-[10px] text-muted">{p.resueltoPor.nombre}</p>}
                  </td>
                  <td className="px-5 py-2 text-right">
                    {p.estado === "SOLICITADO" &&
                      (p.colaboradorId === sessionUserId ? (
                        <span className="text-xs text-muted">Tu propia solicitud</span>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <button
                            disabled={pending}
                            onClick={() => startTransition(() => resolverPermiso(p.id, "APROBADO"))}
                            className="rounded-md border border-border px-3 py-1 text-xs font-medium text-emerald-500 transition hover:border-emerald-500 disabled:opacity-50"
                          >
                            Aprobar
                          </button>
                          <button
                            disabled={pending}
                            onClick={() => startTransition(() => resolverPermiso(p.id, "RECHAZADO"))}
                            className="rounded-md border border-border px-3 py-1 text-xs font-medium text-red-500 transition hover:border-red-500 disabled:opacity-50"
                          >
                            Rechazar
                          </button>
                        </div>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
