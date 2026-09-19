"use client";

import { useTransition } from "react";
import Link from "next/link";
import { actualizarEstadoOrden } from "@/app/(app)/taller/actions";
import { ESTADO_ORDEN_LABEL, ESTADO_ORDEN_STYLE, TIPO_SERVICIO_LABEL } from "@/lib/taller";
import type { EstadoOrdenServicio, TipoServicio } from "@prisma/client";

const ESTADOS = Object.keys(ESTADO_ORDEN_LABEL) as EstadoOrdenServicio[];

export type OrdenRow = {
  id: string;
  folio: string;
  tipo: TipoServicio;
  descripcion: string;
  estado: EstadoOrdenServicio;
  fechaInicio: Date;
  fechaFin: Date | null;
  equipo: { codigo: string; marca: string; modelo: string };
  refaccionesPendientes: number;
};

function diasEntre(a: Date, b: Date) {
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86_400_000));
}

export function OrdenesTable({ ordenes }: { ordenes: OrdenRow[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold text-foreground">Órdenes de servicio</h3>
      </div>
      {ordenes.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">Sin órdenes que coincidan con el filtro.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium">Folio</th>
                <th className="px-5 py-2 font-medium">Unidad</th>
                <th className="px-5 py-2 font-medium">Tipo</th>
                <th className="px-5 py-2 font-medium">Descripción</th>
                <th className="px-5 py-2 font-medium">Tiempo</th>
                <th className="px-5 py-2 font-medium">Refacciones</th>
                <th className="px-5 py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="px-5 py-2 font-mono text-xs text-foreground">{o.folio}</td>
                  <td className="px-5 py-2 text-muted">
                    {o.equipo.codigo} — {o.equipo.marca} {o.equipo.modelo}
                  </td>
                  <td className="px-5 py-2 text-muted">{TIPO_SERVICIO_LABEL[o.tipo]}</td>
                  <td className="px-5 py-2 text-foreground">{o.descripcion}</td>
                  <td className="px-5 py-2 text-muted">
                    {o.fechaFin
                      ? `${diasEntre(o.fechaInicio, o.fechaFin)} días`
                      : `${diasEntre(o.fechaInicio, new Date())} días (en curso)`}
                  </td>
                  <td className="px-5 py-2">
                    <Link
                      href={`/taller/refacciones?orden=${o.id}`}
                      className="text-xs text-muted underline hover:text-foreground"
                    >
                      {o.refaccionesPendientes > 0 ? `${o.refaccionesPendientes} pendiente(s)` : "Ver"}
                    </Link>
                  </td>
                  <td className="px-5 py-2">
                    <select
                      disabled={pending}
                      value={o.estado}
                      onChange={(e) =>
                        startTransition(() => actualizarEstadoOrden(o.id, e.target.value as EstadoOrdenServicio))
                      }
                      className={`rounded-full border-0 px-2 py-1 text-xs font-medium outline-none ${ESTADO_ORDEN_STYLE[o.estado]}`}
                    >
                      {ESTADOS.map((estado) => (
                        <option key={estado} value={estado} className="bg-surface text-foreground">
                          {ESTADO_ORDEN_LABEL[estado]}
                        </option>
                      ))}
                    </select>
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
