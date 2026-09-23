"use client";

import { useTransition } from "react";
import { resolverTicket } from "@/app/(app)/sistemas-ti/actions";
import {
  CATEGORIA_TICKET_LABEL,
  PRIORIDAD_TICKET_LABEL,
  PRIORIDAD_TICKET_STYLE,
  ESTADO_TICKET_LABEL,
  ESTADO_TICKET_STYLE,
} from "@/lib/sistemas-ti";
import { formatFechaHora } from "@/lib/format";
import type { CategoriaTicket, PrioridadTicket, EstadoTicket } from "@prisma/client";

export type TicketRow = {
  id: string;
  folio: string;
  titulo: string;
  categoria: CategoriaTicket;
  prioridad: PrioridadTicket;
  estado: EstadoTicket;
  createdAt: Date;
  reportadoPorId: string;
  reportadoPor: { nombre: string };
  resueltoPor: { nombre: string } | null;
};

export function TicketsTable({ tickets, sessionUserId }: { tickets: TicketRow[]; sessionUserId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold text-foreground">Tickets</h3>
      </div>
      {tickets.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">Sin tickets registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium">Folio</th>
                <th className="px-5 py-2 font-medium">Título</th>
                <th className="px-5 py-2 font-medium">Reportado por</th>
                <th className="px-5 py-2 font-medium">Categoría</th>
                <th className="px-5 py-2 font-medium">Prioridad</th>
                <th className="px-5 py-2 font-medium">Estado</th>
                <th className="px-5 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} className="border-t border-border">
                  <td className="px-5 py-2 font-mono text-xs text-foreground">{t.folio}</td>
                  <td className="px-5 py-2 text-foreground">
                    {t.titulo}
                    <p className="text-xs text-muted">{formatFechaHora(t.createdAt)}</p>
                  </td>
                  <td className="px-5 py-2 text-muted">{t.reportadoPor.nombre}</td>
                  <td className="px-5 py-2 text-muted">{CATEGORIA_TICKET_LABEL[t.categoria]}</td>
                  <td className="px-5 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORIDAD_TICKET_STYLE[t.prioridad]}`}>
                      {PRIORIDAD_TICKET_LABEL[t.prioridad]}
                    </span>
                  </td>
                  <td className="px-5 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_TICKET_STYLE[t.estado]}`}>
                      {ESTADO_TICKET_LABEL[t.estado]}
                    </span>
                    {t.resueltoPor && <p className="mt-0.5 text-[10px] text-muted">{t.resueltoPor.nombre}</p>}
                  </td>
                  <td className="px-5 py-2 text-right">
                    {t.estado === "ABIERTO" &&
                      (t.reportadoPorId === sessionUserId ? (
                        <span className="text-xs text-muted">Tu propio ticket</span>
                      ) : (
                        <button
                          disabled={pending}
                          onClick={() => startTransition(() => resolverTicket(t.id))}
                          className="rounded-md border border-border px-3 py-1 text-xs font-medium text-emerald-500 transition hover:border-emerald-500 disabled:opacity-50"
                        >
                          Marcar resuelto
                        </button>
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
