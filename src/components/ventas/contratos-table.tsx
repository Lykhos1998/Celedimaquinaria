"use client";

import { useTransition } from "react";
import { cancelarContrato } from "@/app/(app)/ventas/actions";
import { ESTADO_CONTRATO_LABEL, ESTADO_CONTRATO_STYLE, type EstadoContrato } from "@/lib/comercial";
import { formatFechaHora } from "@/lib/format";

export type ContratoRow = {
  id: string;
  folio: string;
  valorMensual: number;
  fechaInicio: Date;
  fechaFin: Date;
  estado: EstadoContrato;
  lead: { nombre: string };
  asesor: { nombre: string };
  equipo: { codigo: string } | null;
};

export function ContratosTable({ contratos }: { contratos: ContratoRow[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold text-foreground">Contratos</h3>
      </div>
      {contratos.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">Sin contratos registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium">Folio</th>
                <th className="px-5 py-2 font-medium">Cliente</th>
                <th className="px-5 py-2 font-medium">Asesor</th>
                <th className="px-5 py-2 font-medium">Unidad</th>
                <th className="px-5 py-2 font-medium">Estado</th>
                <th className="px-5 py-2 font-medium">Valor mensual</th>
                <th className="px-5 py-2 font-medium">Inicio</th>
                <th className="px-5 py-2 font-medium">Fin</th>
                <th className="px-5 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {contratos.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-5 py-2 font-mono text-xs text-foreground">{c.folio}</td>
                  <td className="px-5 py-2 text-foreground">{c.lead.nombre}</td>
                  <td className="px-5 py-2 text-muted">{c.asesor.nombre}</td>
                  <td className="px-5 py-2 font-mono text-xs text-muted">{c.equipo?.codigo ?? "—"}</td>
                  <td className="px-5 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_CONTRATO_STYLE[c.estado]}`}>
                      {ESTADO_CONTRATO_LABEL[c.estado]}
                    </span>
                  </td>
                  <td className="px-5 py-2 text-muted">${c.valorMensual.toLocaleString("es-MX")}</td>
                  <td className="px-5 py-2 text-muted">{formatFechaHora(c.fechaInicio)}</td>
                  <td className="px-5 py-2 text-muted">{formatFechaHora(c.fechaFin)}</td>
                  <td className="px-5 py-2 text-right">
                    {c.estado !== "CANCELADO" && c.estado !== "TERMINADO" && (
                      <button
                        disabled={pending}
                        onClick={() => startTransition(() => cancelarContrato(c.id))}
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
