"use client";

import { useTransition } from "react";
import { avanzarVale } from "@/app/(app)/vigilancia/actions";
import { formatFechaHora } from "@/lib/format";
import type { EstadoVale } from "@prisma/client";

export type ValeRow = {
  id: string;
  folio: string;
  activo: string;
  estado: EstadoVale;
  fechaSalida: Date | null;
  fechaRetorno: Date | null;
  createdAt: Date;
  solicitante: { nombre: string };
};

const ESTADO_LABEL: Record<EstadoVale, string> = {
  SOLICITADO: "Solicitado",
  AUTORIZADO: "Autorizado",
  EN_SALIDA: "En salida",
  RETORNADO: "Retornado",
  VENCIDO: "Vencido",
};

const ESTADO_STYLE: Record<EstadoVale, string> = {
  SOLICITADO: "bg-slate-500/15 text-slate-400",
  AUTORIZADO: "bg-blue-500/15 text-blue-500",
  EN_SALIDA: "bg-amber-500/15 text-amber-500",
  RETORNADO: "bg-emerald-500/15 text-emerald-500",
  VENCIDO: "bg-red-500/15 text-red-500",
};

const SIGUIENTE_ESTADO: Partial<Record<EstadoVale, { estado: EstadoVale; label: string }>> = {
  SOLICITADO: { estado: "AUTORIZADO", label: "Autorizar" },
  AUTORIZADO: { estado: "EN_SALIDA", label: "Marcar salida" },
  EN_SALIDA: { estado: "RETORNADO", label: "Marcar retorno" },
};

export function ValesTable({ vales }: { vales: ValeRow[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold text-foreground">Vales activos</h3>
      </div>
      {vales.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">Sin vales de salida registrados.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th className="px-5 py-2 font-medium">Folio</th>
              <th className="px-5 py-2 font-medium">Activo</th>
              <th className="px-5 py-2 font-medium">Colaborador</th>
              <th className="px-5 py-2 font-medium">Estado</th>
              <th className="px-5 py-2 font-medium">Salida</th>
              <th className="px-5 py-2 font-medium">Retorno</th>
              <th className="px-5 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {vales.map((v) => {
              const siguiente = SIGUIENTE_ESTADO[v.estado];
              return (
                <tr key={v.id} className="border-t border-border">
                  <td className="px-5 py-2 font-mono text-xs text-foreground">{v.folio}</td>
                  <td className="px-5 py-2 text-foreground">{v.activo}</td>
                  <td className="px-5 py-2 text-muted">{v.solicitante.nombre}</td>
                  <td className="px-5 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_STYLE[v.estado]}`}>
                      {ESTADO_LABEL[v.estado]}
                    </span>
                  </td>
                  <td className="px-5 py-2 text-muted">
                    {v.fechaSalida ? formatFechaHora(v.fechaSalida) : "—"}
                  </td>
                  <td className="px-5 py-2 text-muted">
                    {v.fechaRetorno ? formatFechaHora(v.fechaRetorno) : "—"}
                  </td>
                  <td className="px-5 py-2 text-right">
                    {siguiente && (
                      <button
                        disabled={pending}
                        onClick={() =>
                          startTransition(() => avanzarVale(v.id, siguiente.estado))
                        }
                        className="rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground transition hover:border-brand hover:text-brand disabled:opacity-50"
                      >
                        {siguiente.label}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
