import { ETAPAS_PIPELINE, ETAPA_LABEL } from "@/lib/comercial";
import { KanbanCard, type EquipoDisponible, type LeadCardData } from "@/components/ventas/kanban-card";

export function KanbanBoard({
  leads,
  equiposDisponibles,
}: {
  leads: LeadCardData[];
  equiposDisponibles: EquipoDisponible[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 overflow-x-auto sm:grid-cols-2 lg:grid-cols-5">
      {ETAPAS_PIPELINE.map((etapa) => {
        const columna = leads.filter((l) => l.etapa === etapa);
        const valorTotal = columna.reduce((acc, l) => acc + (l.valorEstimado ?? 0), 0);
        return (
          <div key={etapa} className="flex min-w-[220px] flex-col gap-3 rounded-xl border border-border bg-surface p-3">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">{ETAPA_LABEL[etapa]}</h3>
                <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs text-muted">{columna.length}</span>
              </div>
              <p className="text-xs text-muted">${valorTotal.toLocaleString("es-MX")}</p>
            </div>
            <div className="flex flex-col gap-2">
              {columna.length === 0 ? (
                <p className="rounded-md border border-dashed border-border px-2 py-4 text-center text-xs text-muted">
                  Sin leads
                </p>
              ) : (
                columna.map((lead) => (
                  <KanbanCard key={lead.id} lead={lead} equiposDisponibles={equiposDisponibles} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
