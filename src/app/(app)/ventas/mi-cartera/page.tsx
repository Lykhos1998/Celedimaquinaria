import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { KpiCard } from "@/components/kpi-card";
import {
  ESTADO_CONTRATO_LABEL,
  ESTADO_CONTRATO_STYLE,
  ETAPA_LABEL,
  comisionEstimada,
  estadoContrato,
} from "@/lib/comercial";
import { formatFechaHora } from "@/lib/format";

export default async function MiCarteraPage() {
  const session = await auth();
  const asesorId = session!.user.id;

  const [leads, contratos] = await Promise.all([
    prisma.lead.findMany({ where: { asesorId }, orderBy: { createdAt: "desc" } }),
    prisma.contrato.findMany({
      where: { asesorId },
      include: { lead: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const contratosConEstado = contratos.map((c) => ({ ...c, estado: estadoContrato(c) }));
  const activos = contratosConEstado.filter((c) => c.estado === "ACTIVO" || c.estado === "POR_VENCER");
  const porVencer = contratosConEstado.filter((c) => c.estado === "POR_VENCER");
  const inactivos = contratosConEstado.filter((c) => c.estado === "TERMINADO" || c.estado === "CANCELADO");
  const prospectos = leads.filter((l) => l.etapa !== "GANADO" && l.etapa !== "PERDIDO");
  const clientesReactivacion = [
    ...inactivos.map((c) => c.lead),
    ...leads.filter((l) => l.etapa === "PERDIDO"),
  ];

  const comisionMensual = activos.reduce((acc, c) => acc + comisionEstimada(c.valorMensual), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Clientes activos" value={activos.length} />
        <KpiCard label="Prospectos en pipeline" value={prospectos.length} />
        <KpiCard label="Comisión estimada / mes" value={`$${comisionMensual.toLocaleString("es-MX", { maximumFractionDigits: 0 })}`} />
        <KpiCard label="Contratos por vencer" value={porVencer.length} hint="≤ 15 días" />
      </div>

      {porVencer.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <h3 className="text-sm font-semibold text-amber-500">Alertas: contratos por vencer</h3>
          <ul className="mt-3 space-y-1 text-sm">
            {porVencer.map((c) => (
              <li key={c.id} className="flex justify-between text-foreground">
                <span>
                  {c.folio} — {c.lead.nombre}
                </span>
                <span className="text-muted">Vence {formatFechaHora(c.fechaFin)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold text-foreground">Prospectos (pipeline)</h3>
        </div>
        {prospectos.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">Sin prospectos asignados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium">Folio</th>
                <th className="px-5 py-2 font-medium">Nombre</th>
                <th className="px-5 py-2 font-medium">Etapa</th>
                <th className="px-5 py-2 font-medium">Valor estimado</th>
              </tr>
            </thead>
            <tbody>
              {prospectos.map((l) => (
                <tr key={l.id} className="border-t border-border">
                  <td className="px-5 py-2 font-mono text-xs text-foreground">{l.folio}</td>
                  <td className="px-5 py-2 text-foreground">{l.nombre}</td>
                  <td className="px-5 py-2 text-muted">{ETAPA_LABEL[l.etapa]}</td>
                  <td className="px-5 py-2 text-muted">
                    {l.valorEstimado ? `$${l.valorEstimado.toLocaleString("es-MX")}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold text-foreground">Clientes activos</h3>
        </div>
        {activos.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">Sin contratos activos.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium">Folio</th>
                <th className="px-5 py-2 font-medium">Cliente</th>
                <th className="px-5 py-2 font-medium">Estado</th>
                <th className="px-5 py-2 font-medium">Valor mensual</th>
                <th className="px-5 py-2 font-medium">Comisión</th>
                <th className="px-5 py-2 font-medium">Vence</th>
              </tr>
            </thead>
            <tbody>
              {activos.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-5 py-2 font-mono text-xs text-foreground">{c.folio}</td>
                  <td className="px-5 py-2 text-foreground">{c.lead.nombre}</td>
                  <td className="px-5 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_CONTRATO_STYLE[c.estado]}`}>
                      {ESTADO_CONTRATO_LABEL[c.estado]}
                    </span>
                  </td>
                  <td className="px-5 py-2 text-muted">${c.valorMensual.toLocaleString("es-MX")}</td>
                  <td className="px-5 py-2 text-muted">${comisionEstimada(c.valorMensual).toLocaleString("es-MX", { maximumFractionDigits: 0 })}</td>
                  <td className="px-5 py-2 text-muted">{formatFechaHora(c.fechaFin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold text-foreground">Clientes sin renta activa (reactivación)</h3>
        </div>
        {clientesReactivacion.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">Sin clientes pendientes de reactivar.</p>
        ) : (
          <ul className="divide-y divide-border">
            {clientesReactivacion.map((l) => (
              <li key={l.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-foreground">{l.nombre}</span>
                <span className="text-muted">{l.telefono ?? l.email ?? "Sin contacto"}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
