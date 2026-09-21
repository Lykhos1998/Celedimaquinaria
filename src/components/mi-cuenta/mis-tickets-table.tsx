import {
  CATEGORIA_TICKET_LABEL,
  PRIORIDAD_TICKET_LABEL,
  PRIORIDAD_TICKET_STYLE,
  ESTADO_TICKET_LABEL,
  ESTADO_TICKET_STYLE,
} from "@/lib/sistemas-ti";
import { formatFechaHora } from "@/lib/format";
import type { CategoriaTicket, PrioridadTicket, EstadoTicket } from "@prisma/client";

export type MiTicketRow = {
  id: string;
  folio: string;
  titulo: string;
  categoria: CategoriaTicket;
  prioridad: PrioridadTicket;
  estado: EstadoTicket;
  createdAt: Date;
};

export function MisTicketsTable({ tickets }: { tickets: MiTicketRow[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold text-foreground">Mis tickets</h3>
      </div>
      {tickets.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">No has reportado ningún ticket.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium">Folio</th>
                <th className="px-5 py-2 font-medium">Título</th>
                <th className="px-5 py-2 font-medium">Categoría</th>
                <th className="px-5 py-2 font-medium">Prioridad</th>
                <th className="px-5 py-2 font-medium">Estado</th>
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
