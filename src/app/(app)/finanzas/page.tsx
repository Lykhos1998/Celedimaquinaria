import { prisma } from "@/lib/prisma";
import { KpiCard } from "@/components/kpi-card";
import { CuentaCobrarForm } from "@/components/finanzas/cuenta-cobrar-form";
import { CuentasCobrarTable } from "@/components/finanzas/cuentas-cobrar-table";

export default async function FinanzasPage() {
  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const inicioMesSiguiente = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 1);

  const [contratosActivos, daniosSinCobrar, cuentas] = await Promise.all([
    prisma.contrato.findMany({
      where: { cancelado: false, fechaInicio: { lte: ahora }, fechaFin: { gte: ahora } },
      include: { lead: true, cuentasCobrar: { where: { concepto: "RENTA_MENSUAL" } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.danio.findMany({
      where: { costoEstimado: { gt: 0 }, cuentaCobrar: null },
      include: { reporte: { include: { equipo: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.cuentaCobrar.findMany({
      include: { registradoPor: true, cobradoPor: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Contratos sin una cuenta de renta mensual generada todavía este mes.
  const contratosSinCobro = contratosActivos.filter(
    (c) => !c.cuentasCobrar.some((cc) => cc.fechaVencimiento >= inicioMes && cc.fechaVencimiento < inicioMesSiguiente),
  );

  const pendiente = cuentas.filter((c) => !c.cobrada).reduce((acc, c) => acc + c.monto, 0);
  const vencido = cuentas
    .filter((c) => !c.cobrada && c.fechaVencimiento < ahora)
    .reduce((acc, c) => acc + c.monto, 0);
  const cobradoEsteMes = cuentas
    .filter((c) => c.cobrada && c.fechaCobro && c.fechaCobro >= inicioMes)
    .reduce((acc, c) => acc + c.monto, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Por cobrar (pendiente)" value={`$${pendiente.toLocaleString("es-MX")}`} />
        <KpiCard label="Vencido" value={`$${vencido.toLocaleString("es-MX")}`} hint="Sin cobrar y fuera de plazo" />
        <KpiCard label="Cobrado este mes" value={`$${cobradoEsteMes.toLocaleString("es-MX")}`} />
      </div>

      <CuentaCobrarForm
        contratos={contratosSinCobro.map((c) => ({
          id: c.id,
          folio: c.folio,
          clienteNombre: c.lead.nombre,
          valorMensual: c.valorMensual,
        }))}
        danios={daniosSinCobrar.map((d) => ({
          id: d.id,
          tipo: d.tipo,
          reporteFolio: d.reporte.folio,
          equipoCodigo: d.reporte.equipo.codigo,
          costoEstimado: d.costoEstimado ?? 0,
        }))}
      />

      <CuentasCobrarTable cuentas={cuentas} />
    </div>
  );
}
