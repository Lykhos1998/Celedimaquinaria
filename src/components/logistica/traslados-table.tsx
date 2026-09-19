"use client";

import { useTransition } from "react";
import { cancelarTraslado } from "@/app/(app)/logistica/actions";
import { ESTADO_TRASLADO_LABEL, ESTADO_TRASLADO_STYLE, TIPO_MOVIMIENTO_LABEL } from "@/lib/logistica";
import { formatFechaHora } from "@/lib/format";
import type { EstadoTraslado, TipoMovimiento } from "@prisma/client";

export type TrasladoRow = {
  id: string;
  folio: string;
  tipoMovimiento: TipoMovimiento;
  origen: string;
  destino: string;
  estado: EstadoTraslado;
  fechaProgramada: Date;
  fechaSalida: Date | null;
  fechaEntrega: Date | null;
  equipo: { codigo: string };
  camion: { placa: string };
};

export function TrasladosTable({ traslados }: { traslados: TrasladoRow[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold text-foreground">Traslados</h3>
      </div>
      {traslados.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">Sin traslados programados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium">Folio</th>
                <th className="px-5 py-2 font-medium">Unidad</th>
                <th className="px-5 py-2 font-medium">Camión</th>
                <th className="px-5 py-2 font-medium">Movimiento</th>
                <th className="px-5 py-2 font-medium">Ruta</th>
                <th className="px-5 py-2 font-medium">Programado</th>
                <th className="px-5 py-2 font-medium">Salida</th>
                <th className="px-5 py-2 font-medium">Entrega</th>
                <th className="px-5 py-2 font-medium">Estado</th>
                <th className="px-5 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {traslados.map((t) => (
                <tr key={t.id} className="border-t border-border">
                  <td className="px-5 py-2 font-mono text-xs text-foreground">{t.folio}</td>
                  <td className="px-5 py-2 text-muted">{t.equipo.codigo}</td>
                  <td className="px-5 py-2 text-muted">{t.camion.placa}</td>
                  <td className="px-5 py-2 text-muted">{TIPO_MOVIMIENTO_LABEL[t.tipoMovimiento]}</td>
                  <td className="px-5 py-2 text-muted">
                    {t.origen} → {t.destino}
                  </td>
                  <td className="px-5 py-2 text-muted">{formatFechaHora(t.fechaProgramada)}</td>
                  <td className="px-5 py-2 text-muted">{t.fechaSalida ? formatFechaHora(t.fechaSalida) : "—"}</td>
                  <td className="px-5 py-2 text-muted">{t.fechaEntrega ? formatFechaHora(t.fechaEntrega) : "—"}</td>
                  <td className="px-5 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_TRASLADO_STYLE[t.estado]}`}>
                      {ESTADO_TRASLADO_LABEL[t.estado]}
                    </span>
                  </td>
                  <td className="px-5 py-2 text-right">
                    {t.estado === "PROGRAMADO" && (
                      <button
                        disabled={pending}
                        onClick={() => startTransition(() => cancelarTraslado(t.id))}
                        className="rounded-md border border-border px-3 py-1 text-xs font-medium text-red-500 transition hover:border-red-500 disabled:opacity-50"
                      >
                        Cancelar
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
