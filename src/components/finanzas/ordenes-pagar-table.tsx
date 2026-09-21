"use client";

import { useTransition } from "react";
import { marcarOrdenCompraPagada } from "@/app/(app)/finanzas/actions";
import { AREA_LABEL, ESTADO_OC_LABEL, ESTADO_OC_STYLE } from "@/lib/compras";
import { formatFechaHora } from "@/lib/format";
import type { AreaSolicitante, EstadoOrdenCompra } from "@prisma/client";

export type OrdenPagarRow = {
  id: string;
  folio: string;
  descripcion: string;
  monto: number;
  area: AreaSolicitante;
  estado: EstadoOrdenCompra;
  pagada: boolean;
  fechaPago: Date | null;
  proveedor: { nombre: string };
  pagadoPor: { nombre: string } | null;
};

export function OrdenesPagarTable({ ordenes }: { ordenes: OrdenPagarRow[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold text-foreground">Cuentas por pagar</h3>
        <p className="text-xs text-muted">Órdenes de compra ya aprobadas por Dirección.</p>
      </div>
      {ordenes.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">Sin órdenes de compra aprobadas todavía.</p>
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
                <th className="px-5 py-2 font-medium">Orden</th>
                <th className="px-5 py-2 font-medium">Pago</th>
                <th className="px-5 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="px-5 py-2 font-mono text-xs text-foreground">{o.folio}</td>
                  <td className="px-5 py-2 text-foreground">{o.descripcion}</td>
                  <td className="px-5 py-2 text-muted">{AREA_LABEL[o.area]}</td>
                  <td className="px-5 py-2 text-muted">{o.proveedor.nombre}</td>
                  <td className="px-5 py-2 text-muted">${o.monto.toLocaleString("es-MX")}</td>
                  <td className="px-5 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_OC_STYLE[o.estado]}`}>
                      {ESTADO_OC_LABEL[o.estado]}
                    </span>
                  </td>
                  <td className="px-5 py-2">
                    {o.pagada ? (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-500">
                        Pagada
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-500">
                        Pendiente
                      </span>
                    )}
                    {o.pagadoPor && (
                      <p className="mt-0.5 text-[10px] text-muted">
                        {o.pagadoPor.nombre} · {o.fechaPago && formatFechaHora(o.fechaPago)}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-2 text-right">
                    {!o.pagada && (
                      <button
                        disabled={pending}
                        onClick={() => startTransition(() => marcarOrdenCompraPagada(o.id))}
                        className="rounded-md border border-border px-3 py-1 text-xs font-medium text-emerald-500 transition hover:border-emerald-500 disabled:opacity-50"
                      >
                        Marcar pagada
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
