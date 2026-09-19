"use client";

import { useTransition } from "react";
import { marcarRefaccionRecibida } from "@/app/(app)/taller/actions";
import { ESTADO_REFACCION_LABEL, ESTADO_REFACCION_STYLE } from "@/lib/taller";
import { formatFechaHora } from "@/lib/format";
import type { EstadoRefaccion } from "@prisma/client";

export type RefaccionRow = {
  id: string;
  descripcion: string;
  cantidad: number;
  estado: EstadoRefaccion;
  createdAt: Date;
  ordenServicio: { folio: string };
  solicitadoPor: { nombre: string };
};

export function RefaccionesTable({ refacciones }: { refacciones: RefaccionRow[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold text-foreground">Refacciones solicitadas</h3>
      </div>
      {refacciones.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">Sin refacciones solicitadas.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th className="px-5 py-2 font-medium">Orden</th>
              <th className="px-5 py-2 font-medium">Refacción</th>
              <th className="px-5 py-2 font-medium">Cantidad</th>
              <th className="px-5 py-2 font-medium">Solicitado por</th>
              <th className="px-5 py-2 font-medium">Fecha</th>
              <th className="px-5 py-2 font-medium">Estado</th>
              <th className="px-5 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {refacciones.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-5 py-2 font-mono text-xs text-foreground">{r.ordenServicio.folio}</td>
                <td className="px-5 py-2 text-foreground">{r.descripcion}</td>
                <td className="px-5 py-2 text-muted">{r.cantidad}</td>
                <td className="px-5 py-2 text-muted">{r.solicitadoPor.nombre}</td>
                <td className="px-5 py-2 text-muted">{formatFechaHora(r.createdAt)}</td>
                <td className="px-5 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_REFACCION_STYLE[r.estado]}`}>
                    {ESTADO_REFACCION_LABEL[r.estado]}
                  </span>
                </td>
                <td className="px-5 py-2 text-right">
                  {r.estado === "SOLICITADA" && (
                    <button
                      disabled={pending}
                      onClick={() => startTransition(() => marcarRefaccionRecibida(r.id))}
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
      )}
    </div>
  );
}
