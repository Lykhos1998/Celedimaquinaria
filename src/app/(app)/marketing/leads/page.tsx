import { prisma } from "@/lib/prisma";
import { LeadForm } from "@/components/marketing/lead-form";
import {
  CANAL_LABEL,
  ETAPA_LABEL,
  TEMPERATURA_LABEL,
  TEMPERATURA_STYLE,
  TIPO_TRABAJO_LABEL,
} from "@/lib/comercial";
import { formatFechaHora } from "@/lib/format";

export default async function LeadsPage() {
  const [asesores, leads] = await Promise.all([
    prisma.user.findMany({
      where: { rol: "ASESOR_VENTAS", activo: true },
      select: { id: true, nombre: true },
      orderBy: { nombre: "asc" },
    }),
    prisma.lead.findMany({
      include: { asesor: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <LeadForm asesores={asesores} />

      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold text-foreground">Leads capturados</h3>
        </div>
        {leads.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">Sin leads registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted">
                  <th className="px-5 py-2 font-medium">Folio</th>
                  <th className="px-5 py-2 font-medium">Nombre</th>
                  <th className="px-5 py-2 font-medium">Canal</th>
                  <th className="px-5 py-2 font-medium">Tipo</th>
                  <th className="px-5 py-2 font-medium">Etapa</th>
                  <th className="px-5 py-2 font-medium">Temp.</th>
                  <th className="px-5 py-2 font-medium">Asesor</th>
                  <th className="px-5 py-2 font-medium">Valor est.</th>
                  <th className="px-5 py-2 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-t border-border">
                    <td className="px-5 py-2 font-mono text-xs text-foreground">{l.folio}</td>
                    <td className="px-5 py-2 text-foreground">{l.nombre}</td>
                    <td className="px-5 py-2 text-muted">{CANAL_LABEL[l.canal]}</td>
                    <td className="px-5 py-2 text-muted">{TIPO_TRABAJO_LABEL[l.tipoTrabajo]}</td>
                    <td className="px-5 py-2 text-muted">{ETAPA_LABEL[l.etapa]}</td>
                    <td className="px-5 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TEMPERATURA_STYLE[l.temperatura]}`}>
                        {TEMPERATURA_LABEL[l.temperatura]}
                      </span>
                    </td>
                    <td className="px-5 py-2 text-muted">{l.asesor?.nombre ?? "Sin asignar"}</td>
                    <td className="px-5 py-2 text-muted">
                      {l.valorEstimado ? `$${l.valorEstimado.toLocaleString("es-MX")}` : "—"}
                    </td>
                    <td className="px-5 py-2 text-muted">{formatFechaHora(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
