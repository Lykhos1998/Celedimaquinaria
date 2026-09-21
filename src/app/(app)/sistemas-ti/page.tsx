import { prisma } from "@/lib/prisma";
import { KpiCard } from "@/components/kpi-card";
import { TicketForm } from "@/components/sistemas-ti/ticket-form";
import { TicketsTable } from "@/components/sistemas-ti/tickets-table";

export default async function SistemasTIPage() {
  const [colaboradores, tickets, abiertos, altaPrioridad] = await Promise.all([
    prisma.user.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } }),
    prisma.ticketSoporte.findMany({
      include: { reportadoPor: true, resueltoPor: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.ticketSoporte.count({ where: { estado: "ABIERTO" } }),
    prisma.ticketSoporte.count({ where: { estado: "ABIERTO", prioridad: "ALTA" } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Tickets abiertos" value={abiertos} />
        <KpiCard label="Prioridad alta sin resolver" value={altaPrioridad} />
        <KpiCard label="Total histórico" value={tickets.length} />
      </div>

      <TicketForm colaboradores={colaboradores.map((c) => ({ id: c.id, nombre: c.nombre }))} />
      <TicketsTable tickets={tickets} />
    </div>
  );
}
