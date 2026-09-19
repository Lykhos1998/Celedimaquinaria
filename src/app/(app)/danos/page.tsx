import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { KpiCard } from "@/components/kpi-card";
import { ReporteForm } from "@/components/danos/reporte-form";
import { formatFechaHora } from "@/lib/format";

export default async function InspeccionesPage() {
  const [equipos, contratos, reportes] = await Promise.all([
    prisma.equipo.findMany({
      orderBy: { codigo: "asc" },
      select: { id: true, codigo: true, marca: true, modelo: true },
    }),
    prisma.contrato.findMany({
      include: { lead: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.reporteInspeccion.findMany({
      include: { equipo: true, contrato: { include: { lead: true } }, danos: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalReportes = reportes.length;
  const conDanos = reportes.filter((r) => r.danos.length > 0).length;
  const costoTotal = reportes.reduce(
    (acc, r) => acc + r.danos.reduce((a, d) => a + (d.costoEstimado ?? 0), 0),
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Reportes de inspección" value={totalReportes} />
        <KpiCard label="Con daños encontrados" value={conDanos} />
        <KpiCard label="Sin daños" value={totalReportes - conDanos} />
        <KpiCard label="Costo estimado total" value={`$${costoTotal.toLocaleString("es-MX")}`} />
      </div>

      <ReporteForm
        equipos={equipos}
        contratos={contratos.map((c) => ({ id: c.id, folio: c.folio, equipoId: c.equipoId ?? "", clienteNombre: c.lead.nombre }))}
      />

      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold text-foreground">Reportes de inspección</h3>
        </div>
        {reportes.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">Sin reportes registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted">
                  <th className="px-5 py-2 font-medium">Folio</th>
                  <th className="px-5 py-2 font-medium">Unidad</th>
                  <th className="px-5 py-2 font-medium">Contrato</th>
                  <th className="px-5 py-2 font-medium">Observaciones</th>
                  <th className="px-5 py-2 font-medium">Fecha</th>
                  <th className="px-5 py-2 font-medium">Daños</th>
                </tr>
              </thead>
              <tbody>
                {reportes.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-5 py-2 font-mono text-xs text-foreground">{r.folio}</td>
                    <td className="px-5 py-2 text-muted">{r.equipo.codigo}</td>
                    <td className="px-5 py-2 text-muted">{r.contrato ? `${r.contrato.folio} — ${r.contrato.lead.nombre}` : "—"}</td>
                    <td className="px-5 py-2 text-muted">{r.observaciones ?? "—"}</td>
                    <td className="px-5 py-2 text-muted">{formatFechaHora(r.createdAt)}</td>
                    <td className="px-5 py-2">
                      <Link
                        href={`/danos/hallazgos?reporte=${r.id}`}
                        className="text-xs text-muted underline hover:text-foreground"
                      >
                        {r.danos.length > 0 ? `${r.danos.length} registrado(s)` : "Sin daños · agregar"}
                      </Link>
                    </td>
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
