"use client";

import { useTransition } from "react";
import { aprobarOrdenCompra, rechazarOrdenCompra, marcarOrdenRecibida } from "@/app/(app)/compras/actions";
import { AREA_LABEL, ESTADO_OC_LABEL, ESTADO_OC_STYLE } from "@/lib/compras";
import { formatFechaHora } from "@/lib/format";
import type { AreaSolicitante, EstadoOrdenCompra } from "@prisma/client";

export type OrdenCompraRow = {
  id: string;
  folio: string;
  descripcion: string;
  monto: number;
  area: AreaSolicitante;
  estado: EstadoOrdenCompra;
  createdAt: Date;
  proveedor: { nombre: string };
  registradoPor: { nombre: string };
  aprobadoPor: { nombre: string } | null;
  refaccion: { ordenServicio: { folio: string } } | null;
};

export function OrdenesCompraTable({
  ordenes,
  esDireccion,
}: {
  ordenes: OrdenCompraRow[];
  esDireccion: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold text-foreground">Órdenes de compra</h3>
      </div>
      {ordenes.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">Sin órdenes de compra registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium">Folio</th>
                <th className="px-5 py-2 font-medium">Descripción</th>
                <th className="px-5 py-2 font-medium">Área</th>
                <th className="px-5 py-2 font-medium">Proveedor</th>
                <th className="px-5 py-2 font-medium">Monto</th>
                <th className="px-5 py-2 font-medium">Registrada por</th>
                <th className="px-5 py-2 font-medium">Estado</th>
                <th className="px-5 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="px-5 py-2 font-mono text-xs text-foreground">{o.folio}</td>
                  <td className="px-5 py-2 text-foreground">
                    {o.descripcion}
                    {o.refaccion && (
                      <span className="ml-1 text-xs text-muted">({o.refaccion.ordenServicio.folio})</span>
                    )}
                  </td>
                  <td className="px-5 py-2 text-muted">{AREA_LABEL[o.area]}</td>
                  <td className="px-5 py-2 text-muted">{o.proveedor.nombre}</td>
                  <td className="px-5 py-2 text-muted">${o.monto.toLocaleString("es-MX")}</td>
                  <td className="px-5 py-2 text-muted">{o.registradoPor.nombre}</td>
                  <td className="px-5 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_OC_STYLE[o.estado]}`}>
                      {ESTADO_OC_LABEL[o.estado]}
                    </span>
                    {o.aprobadoPor && (
                      <p className="mt-0.5 text-[10px] text-muted">
                        {o.aprobadoPor.nombre} · {formatFechaHora(o.createdAt)}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-2 text-right">
                    {o.estado === "PENDIENTE_APROBACION" && esDireccion && (
                      <div className="flex justify-end gap-1">
                        <button
                          disabled={pending}
                          onClick={() => startTransition(() => aprobarOrdenCompra(o.id))}
                          className="rounded-md border border-border px-3 py-1 text-xs font-medium text-emerald-500 transition hover:border-emerald-500 disabled:opacity-50"
                        >
                          Aprobar
                        </button>
                        <button
                          disabled={pending}
                          onClick={() => startTransition(() => rechazarOrdenCompra(o.id))}
                          className="rounded-md border border-border px-3 py-1 text-xs font-medium text-red-500 transition hover:border-red-500 disabled:opacity-50"
                        >
                          Rechazar
                        </button>
                      </div>
                    )}
                    {o.estado === "PENDIENTE_APROBACION" && !esDireccion && (
                      <span className="text-xs text-muted">Esperando a Dirección</span>
                    )}
                    {o.estado === "APROBADA" && (
                      <button
                        disabled={pending}
                        onClick={() => startTransition(() => marcarOrdenRecibida(o.id))}
                        className="rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground transition hover:border-brand hover:text-brand disabled:opacity-50"
                      >
                        Marcar recibida
                      </button>
                    )}
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
