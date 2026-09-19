import { prisma } from "@/lib/prisma";
import { KanbanBoard } from "@/components/ventas/kanban-board";
import { ETAPAS_PIPELINE } from "@/lib/comercial";

export default async function PipelinePage() {
  const [leads, equiposDisponibles] = await Promise.all([
    prisma.lead.findMany({
      where: { etapa: { in: ETAPAS_PIPELINE } },
      include: { asesor: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.equipo.findMany({
      where: { estado: "DISPONIBLE" },
      include: { tarifa: true },
      orderBy: { codigo: "asc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted">
        Flujo Comercial — vista global de todos los asesores, {leads.length} leads activos.
      </p>
      <KanbanBoard
        leads={leads.map((l) => ({
          id: l.id,
          folio: l.folio,
          nombre: l.nombre,
          valorEstimado: l.valorEstimado,
          temperatura: l.temperatura,
          etapa: l.etapa,
          asesorNombre: l.asesor?.nombre ?? null,
        }))}
        equiposDisponibles={equiposDisponibles.map((e) => ({
          id: e.id,
          codigo: e.codigo,
          marca: e.marca,
          modelo: e.modelo,
          precioMensual: e.tarifa?.precioMensual ?? null,
        }))}
      />
    </div>
  );
}
