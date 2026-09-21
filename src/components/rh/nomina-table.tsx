"use client";

import { useTransition } from "react";
import { marcarNominaPagada } from "@/app/(app)/rh/actions";
import { formatFechaHora } from "@/lib/format";

export type NominaRow = {
  id: string;
  folio: string;
  periodoInicio: Date;
  periodoFin: Date;
  diasAsistidos: number;
  sueldoPeriodo: number;
  pagada: boolean;
  fechaPago: Date | null;
  colaborador: { nombre: string };
  pagadoPor: { nombre: string } | null;
};

export function NominaTable({ nominas }: { nominas: NominaRow[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold text-foreground">Nómina generada</h3>
      </div>
      {nominas.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">Sin nómina generada todavía.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium">Folio</th>
                <th className="px-5 py-2 font-medium">Colaborador</th>
                <th className="px-5 py-2 font-medium">Periodo</th>
                <th className="px-5 py-2 font-medium">Días asistidos</th>
                <th className="px-5 py-2 font-medium">Sueldo</th>
                <th className="px-5 py-2 font-medium">Pago</th>
                <th className="px-5 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {nominas.map((n) => (
                <tr key={n.id} className="border-t border-border">
                  <td className="px-5 py-2 font-mono text-xs text-foreground">{n.folio}</td>
                  <td className="px-5 py-2 text-foreground">{n.colaborador.nombre}</td>
                  <td className="px-5 py-2 text-muted">
                    {formatFechaHora(n.periodoInicio)} – {formatFechaHora(n.periodoFin)}
                  </td>
                  <td className="px-5 py-2 text-muted">{n.diasAsistidos}</td>
                  <td className="px-5 py-2 text-muted">${n.sueldoPeriodo.toLocaleString("es-MX")}</td>
                  <td className="px-5 py-2">
                    {n.pagada ? (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-500">
                        Pagada
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-500">
                        Pendiente
                      </span>
                    )}
                    {n.pagadoPor && (
                      <p className="mt-0.5 text-[10px] text-muted">
                        {n.pagadoPor.nombre} · {n.fechaPago && formatFechaHora(n.fechaPago)}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-2 text-right">
                    {!n.pagada && (
                      <button
                        disabled={pending}
                        onClick={() => startTransition(() => marcarNominaPagada(n.id))}
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
