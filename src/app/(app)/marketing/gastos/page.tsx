import { prisma } from "@/lib/prisma";
import { GastoForm } from "@/components/marketing/gasto-form";
import { CANAL_LABEL } from "@/lib/comercial";
import { formatFechaHora } from "@/lib/format";
import type { CanalLead } from "@prisma/client";

const CANALES = Object.keys(CANAL_LABEL) as CanalLead[];

export default async function GastosPage() {
  const [gastos, gastoPorCanal, leadsPorCanal, ganadosPorCanal] = await Promise.all([
    prisma.gastoPublicitario.findMany({
      include: { registradoPor: true },
      orderBy: { fecha: "desc" },
      take: 50,
    }),
    prisma.gastoPublicitario.groupBy({ by: ["canal"], _sum: { monto: true } }),
    prisma.lead.groupBy({ by: ["canal"], _count: { _all: true } }),
    prisma.lead.groupBy({
      by: ["canal"],
      where: { etapa: "GANADO" },
      _sum: { valorEstimado: true },
    }),
  ]);

  const gastoMap = new Map(gastoPorCanal.map((g) => [g.canal, g._sum.monto ?? 0]));
  const leadsMap = new Map(leadsPorCanal.map((l) => [l.canal, l._count._all]));
  const ganadoMap = new Map(ganadosPorCanal.map((g) => [g.canal, g._sum.valorEstimado ?? 0]));

  const filas = CANALES.map((canal) => {
    const gasto = gastoMap.get(canal) ?? 0;
    const leads = leadsMap.get(canal) ?? 0;
    const valorGanado = ganadoMap.get(canal) ?? 0;
    const costoPorLead = leads > 0 ? gasto / leads : null;
    const roi = gasto > 0 ? ((valorGanado - gasto) / gasto) * 100 : null;
    return { canal, gasto, leads, valorGanado, costoPorLead, roi };
  });

  return (
    <div className="flex flex-col gap-6">
      <GastoForm />

      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold text-foreground">Costo por lead y ROI por canal</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th className="px-5 py-2 font-medium">Canal</th>
              <th className="px-5 py-2 font-medium">Gasto total</th>
              <th className="px-5 py-2 font-medium">Leads</th>
              <th className="px-5 py-2 font-medium">Costo / lead</th>
              <th className="px-5 py-2 font-medium">Valor ganado</th>
              <th className="px-5 py-2 font-medium">ROI</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.canal} className="border-t border-border">
                <td className="px-5 py-2 text-foreground">{CANAL_LABEL[f.canal]}</td>
                <td className="px-5 py-2 text-muted">${f.gasto.toLocaleString("es-MX")}</td>
                <td className="px-5 py-2 text-muted">{f.leads}</td>
                <td className="px-5 py-2 text-muted">
                  {f.costoPorLead !== null ? `$${f.costoPorLead.toLocaleString("es-MX", { maximumFractionDigits: 0 })}` : "—"}
                </td>
                <td className="px-5 py-2 text-muted">${f.valorGanado.toLocaleString("es-MX")}</td>
                <td className="px-5 py-2">
                  {f.roi !== null ? (
                    <span className={f.roi >= 0 ? "text-emerald-500" : "text-red-500"}>
                      {f.roi.toLocaleString("es-MX", { maximumFractionDigits: 0 })}%
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold text-foreground">Gastos registrados</h3>
        </div>
        {gastos.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">Sin gastos registrados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium">Plataforma</th>
                <th className="px-5 py-2 font-medium">Canal</th>
                <th className="px-5 py-2 font-medium">Monto</th>
                <th className="px-5 py-2 font-medium">Registrado por</th>
                <th className="px-5 py-2 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {gastos.map((g) => (
                <tr key={g.id} className="border-t border-border">
                  <td className="px-5 py-2 text-foreground">{g.plataforma}</td>
                  <td className="px-5 py-2 text-muted">{g.canal ? CANAL_LABEL[g.canal] : "—"}</td>
                  <td className="px-5 py-2 text-muted">${g.monto.toLocaleString("es-MX")}</td>
                  <td className="px-5 py-2 text-muted">{g.registradoPor.nombre}</td>
                  <td className="px-5 py-2 text-muted">{formatFechaHora(g.fecha)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
