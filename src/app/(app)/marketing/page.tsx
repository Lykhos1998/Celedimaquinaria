import { prisma } from "@/lib/prisma";
import { KpiCard } from "@/components/kpi-card";
import { SimpleBarChart } from "@/components/simple-bar-chart";
import {
  CANAL_LABEL,
  ETAPAS_PIPELINE,
  ETAPA_LABEL,
  PROBABILIDAD_ETAPA,
  TIPO_TRABAJO_LABEL,
} from "@/lib/comercial";
import type { CanalLead } from "@prisma/client";

const CANALES = Object.keys(CANAL_LABEL) as CanalLead[];
const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function mesActualISO() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
}

function opcionesMes() {
  const opciones: { valor: string; label: string }[] = [];
  const hoy = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    opciones.push({
      valor: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: `${MESES[d.getMonth()]} ${d.getFullYear()}`,
    });
  }
  return opciones;
}

export default async function MarketingDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const { mes } = await searchParams;
  const mesISO = mes ?? mesActualISO();
  const [anio, mesNum] = mesISO.split("-").map(Number);
  const inicioMes = new Date(anio, mesNum - 1, 1);
  const finMes = new Date(anio, mesNum, 1);

  const inicioHace14Dias = new Date();
  inicioHace14Dias.setHours(0, 0, 0, 0);
  inicioHace14Dias.setDate(inicioHace14Dias.getDate() - 13);

  const [
    totalLeadsMes,
    ganadosMes,
    contratosMes,
    todosLeads,
    leadsPerdidos,
    leadsCerrados,
    leadsRecientes,
    leadsPorUbicacion,
    leadsPorTipo,
    ganadosPorAsesor,
  ] = await Promise.all([
    prisma.lead.count({ where: { createdAt: { gte: inicioMes, lt: finMes } } }),
    prisma.lead.count({ where: { etapa: "GANADO", cerradoAt: { gte: inicioMes, lt: finMes } } }),
    prisma.contrato.findMany({ where: { createdAt: { gte: inicioMes, lt: finMes } }, select: { valorMensual: true } }),
    prisma.lead.findMany({ select: { canal: true, etapa: true, valorEstimado: true } }),
    prisma.lead.groupBy({
      by: ["canal", "motivoPerdida"],
      where: { etapa: "PERDIDO" },
      _count: { _all: true },
      _sum: { valorPerdido: true },
    }),
    prisma.lead.findMany({
      where: { cerradoAt: { not: null } },
      select: { canal: true, createdAt: true, cerradoAt: true },
    }),
    prisma.lead.findMany({
      where: { createdAt: { gte: inicioHace14Dias } },
      select: { createdAt: true },
    }),
    prisma.lead.groupBy({ by: ["ubicacion"], _count: { _all: true } }),
    prisma.lead.groupBy({ by: ["tipoTrabajo"], _count: { _all: true } }),
    prisma.lead.findMany({
      where: { etapa: "GANADO" },
      select: { asesor: { select: { nombre: true } } },
    }),
  ]);

  const ingresoMensual = contratosMes.reduce((acc, c) => acc + c.valorMensual, 0);
  const tasaConversionMes = totalLeadsMes > 0 ? (ganadosMes / totalLeadsMes) * 100 : 0;

  // Pronóstico ponderado: leads activos en pipeline (sin cerrar) × probabilidad fija por etapa.
  const pipelineActivo = todosLeads.filter((l) => ETAPAS_PIPELINE.includes(l.etapa));
  const pronostico = pipelineActivo.reduce(
    (acc, l) => acc + (l.valorEstimado ?? 0) * PROBABILIDAD_ETAPA[l.etapa],
    0,
  );
  const contribucionEtapa = ETAPAS_PIPELINE.map((etapa) => {
    const leadsEtapa = pipelineActivo.filter((l) => l.etapa === etapa);
    const valorTotal = leadsEtapa.reduce((a, l) => a + (l.valorEstimado ?? 0), 0);
    return {
      etapa,
      cantidad: leadsEtapa.length,
      valorTotal,
      valorPonderado: valorTotal * PROBABILIDAD_ETAPA[etapa],
    };
  });

  // Funnel por canal (aproximado por la etapa actual alcanzada; PERDIDO no cuenta avance).
  const ordenEtapa = (etapa: string) =>
    etapa === "GANADO" ? ETAPAS_PIPELINE.length : ETAPAS_PIPELINE.indexOf(etapa as (typeof ETAPAS_PIPELINE)[number]);

  const funnel = CANALES.map((canal) => {
    const leads = todosLeads.filter((l) => l.canal === canal);
    const activos = leads.filter((l) => l.etapa !== "PERDIDO");
    const recibidos = leads.length;
    const calificados = activos.filter((l) => ordenEtapa(l.etapa) >= 1).length;
    const cotizados = activos.filter((l) => ordenEtapa(l.etapa) >= 3).length;
    const ganados = leads.filter((l) => l.etapa === "GANADO").length;
    return {
      canal,
      recibidos,
      calificados,
      cotizados,
      ganados,
      tasaCierre: recibidos > 0 ? (ganados / recibidos) * 100 : 0,
    };
  });

  // Razones de pérdida agrupadas por canal.
  const perdidasPorCanal = CANALES.map((canal) => ({
    canal,
    motivos: leadsPerdidos
      .filter((p) => p.canal === canal)
      .map((p) => ({
        motivo: p.motivoPerdida ?? "Sin especificar",
        cantidad: p._count._all,
        valorPerdido: p._sum.valorPerdido ?? 0,
      })),
  })).filter((c) => c.motivos.length > 0);

  // Tiempo de vida promedio del lead (días entre creación y cierre) por canal.
  const vidaPorCanal = CANALES.map((canal) => {
    const cerrados = leadsCerrados.filter((l) => l.canal === canal && l.cerradoAt);
    if (cerrados.length === 0) return { canal, promedioDias: null as number | null, n: 0 };
    const totalDias = cerrados.reduce(
      (acc, l) => acc + (l.cerradoAt!.getTime() - l.createdAt.getTime()) / 86_400_000,
      0,
    );
    return { canal, promedioDias: totalDias / cerrados.length, n: cerrados.length };
  }).filter((c) => c.n > 0);

  // Leads por día, últimos 14 días.
  const leadsPorDia: { label: string; value: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const siguiente = new Date(d);
    siguiente.setDate(siguiente.getDate() + 1);
    const count = leadsRecientes.filter((l) => l.createdAt >= d && l.createdAt < siguiente).length;
    leadsPorDia.push({ label: `${d.getDate()}`, value: count });
  }

  const hubsCerrados = new Map<string, number>();
  for (const l of ganadosPorAsesor) {
    const nombre = l.asesor?.nombre ?? "Sin asignar";
    hubsCerrados.set(nombre, (hubsCerrados.get(nombre) ?? 0) + 1);
  }

  return (
    <div className="flex flex-col gap-6">
      <form className="flex items-center gap-2">
        <label className="text-xs font-medium text-muted">Mes:</label>
        <select
          name="mes"
          defaultValue={mesISO}
          className="rounded-md border border-border bg-surface-muted px-3 py-1.5 text-sm text-foreground outline-none focus:border-brand"
        >
          {opcionesMes().map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:border-brand hover:text-brand"
        >
          Filtrar
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Leads del mes" value={totalLeadsMes} />
        <KpiCard label="Cierres (hubs cerrados)" value={ganadosMes} />
        <KpiCard label="Tasa de conversión" value={`${tasaConversionMes.toLocaleString("es-MX", { maximumFractionDigits: 1 })}%`} />
        <KpiCard label="Ingreso mensual (nuevos contratos)" value={`$${ingresoMensual.toLocaleString("es-MX")}`} />
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="text-sm font-semibold text-foreground">Leads por día (últimos 14 días)</h3>
        <div className="mt-4">
          <SimpleBarChart data={leadsPorDia} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="text-sm font-semibold text-foreground">Pronóstico de cierre — pipeline activo</h3>
        <p className="mt-1 text-xs text-muted">
          Estimado con probabilidad fija por etapa (heurística, no un modelo estadístico).
        </p>
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-2xl font-semibold text-foreground">
            ${pronostico.toLocaleString("es-MX", { maximumFractionDigits: 0 })}
          </span>
          <span className="text-xs text-muted">
            rango ${(pronostico * 0.8).toLocaleString("es-MX", { maximumFractionDigits: 0 })} – $
            {(pronostico * 1.2).toLocaleString("es-MX", { maximumFractionDigits: 0 })}
          </span>
        </div>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th className="py-1 font-medium">Etapa</th>
              <th className="py-1 font-medium">Leads</th>
              <th className="py-1 font-medium">Valor total</th>
              <th className="py-1 font-medium">Valor ponderado</th>
            </tr>
          </thead>
          <tbody>
            {contribucionEtapa.map((c) => (
              <tr key={c.etapa} className="border-t border-border">
                <td className="py-1.5 text-foreground">{ETAPA_LABEL[c.etapa]}</td>
                <td className="py-1.5 text-muted">{c.cantidad}</td>
                <td className="py-1.5 text-muted">${c.valorTotal.toLocaleString("es-MX")}</td>
                <td className="py-1.5 text-muted">${c.valorPonderado.toLocaleString("es-MX", { maximumFractionDigits: 0 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold text-foreground">Funnel de conversión por canal</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th className="px-5 py-2 font-medium">Canal</th>
              <th className="px-5 py-2 font-medium">Recibidos</th>
              <th className="px-5 py-2 font-medium">Calificados</th>
              <th className="px-5 py-2 font-medium">Cotizados</th>
              <th className="px-5 py-2 font-medium">Ganados</th>
              <th className="px-5 py-2 font-medium">Tasa de cierre</th>
            </tr>
          </thead>
          <tbody>
            {funnel.map((f) => (
              <tr key={f.canal} className="border-t border-border">
                <td className="px-5 py-2 text-foreground">{CANAL_LABEL[f.canal]}</td>
                <td className="px-5 py-2 text-muted">{f.recibidos}</td>
                <td className="px-5 py-2 text-muted">{f.calificados}</td>
                <td className="px-5 py-2 text-muted">{f.cotizados}</td>
                <td className="px-5 py-2 text-muted">{f.ganados}</td>
                <td className="px-5 py-2 text-muted">{f.tasaCierre.toLocaleString("es-MX", { maximumFractionDigits: 1 })}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="text-sm font-semibold text-foreground">Razones de pérdida por canal</h3>
          {perdidasPorCanal.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Sin leads perdidos registrados.</p>
          ) : (
            <div className="mt-3 space-y-4">
              {perdidasPorCanal.map((c) => (
                <div key={c.canal}>
                  <p className="text-xs font-medium text-foreground">{CANAL_LABEL[c.canal]}</p>
                  <ul className="mt-1 space-y-1">
                    {c.motivos.map((m) => (
                      <li key={m.motivo} className="flex justify-between text-xs text-muted">
                        <span>
                          {m.motivo} ({m.cantidad})
                        </span>
                        <span>${m.valorPerdido.toLocaleString("es-MX")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="text-sm font-semibold text-foreground">Tiempo de vida del lead por canal</h3>
          {vidaPorCanal.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Aún no hay leads cerrados.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {vidaPorCanal.map((v) => (
                <li key={v.canal} className="flex justify-between text-sm">
                  <span className="text-foreground">{CANAL_LABEL[v.canal]}</span>
                  <span className="text-muted">
                    {v.promedioDias!.toLocaleString("es-MX", { maximumFractionDigits: 1 })} días (promedio, n={v.n})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="text-sm font-semibold text-foreground">Leads por ubicación</h3>
          <ul className="mt-3 space-y-1">
            {leadsPorUbicacion.map((u) => (
              <li key={u.ubicacion ?? "sin-ubicacion"} className="flex justify-between text-sm">
                <span className="text-foreground">{u.ubicacion ?? "Sin especificar"}</span>
                <span className="text-muted">{u._count._all}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="text-sm font-semibold text-foreground">Leads por tipo de trabajo</h3>
          <ul className="mt-3 space-y-1">
            {leadsPorTipo.map((t) => (
              <li key={t.tipoTrabajo} className="flex justify-between text-sm">
                <span className="text-foreground">{TIPO_TRABAJO_LABEL[t.tipoTrabajo]}</span>
                <span className="text-muted">{t._count._all}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="text-sm font-semibold text-foreground">Hubs cerrados por vendedora</h3>
        {hubsCerrados.size === 0 ? (
          <p className="mt-3 text-sm text-muted">Sin cierres registrados todavía.</p>
        ) : (
          <ul className="mt-3 space-y-1">
            {[...hubsCerrados.entries()].map(([nombre, cantidad]) => (
              <li key={nombre} className="flex justify-between text-sm">
                <span className="text-foreground">{nombre}</span>
                <span className="text-muted">{cantidad}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
