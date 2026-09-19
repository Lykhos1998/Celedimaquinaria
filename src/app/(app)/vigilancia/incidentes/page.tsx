import { prisma } from "@/lib/prisma";
import { IncidenteForm } from "@/components/vigilancia/incidente-form";
import { formatFechaHora } from "@/lib/format";

const SEVERIDAD_STYLE: Record<string, string> = {
  BAJA: "bg-slate-500/15 text-slate-400",
  MEDIA: "bg-amber-500/15 text-amber-500",
  ALTA: "bg-red-500/15 text-red-500",
};

const SEVERIDAD_LABEL: Record<string, string> = {
  BAJA: "Baja",
  MEDIA: "Media",
  ALTA: "Alta",
};

export default async function IncidentesPage() {
  const incidentes = await prisma.incidenteSeguridad.findMany({
    include: { registradoPor: true },
    orderBy: { timestamp: "desc" },
    take: 50,
  });

  return (
    <div className="flex flex-col gap-6">
      <IncidenteForm />

      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold text-foreground">Bitácora reciente</h3>
        </div>
        {incidentes.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">Sin incidentes registrados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium">Descripción</th>
                <th className="px-5 py-2 font-medium">Severidad</th>
                <th className="px-5 py-2 font-medium">Registrado por</th>
                <th className="px-5 py-2 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {incidentes.map((i) => (
                <tr key={i.id} className="border-t border-border">
                  <td className="px-5 py-2 text-foreground">{i.descripcion}</td>
                  <td className="px-5 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${SEVERIDAD_STYLE[i.severidad]}`}>
                      {SEVERIDAD_LABEL[i.severidad]}
                    </span>
                  </td>
                  <td className="px-5 py-2 text-muted">{i.registradoPor.nombre}</td>
                  <td className="px-5 py-2 text-muted">{formatFechaHora(i.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
