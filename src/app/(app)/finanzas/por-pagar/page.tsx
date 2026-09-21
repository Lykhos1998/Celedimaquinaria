import { prisma } from "@/lib/prisma";
import { KpiCard } from "@/components/kpi-card";
import { OrdenesPagarTable } from "@/components/finanzas/ordenes-pagar-table";

export default async function FinanzasPorPagarPage() {
  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

  const ordenes = await prisma.ordenCompra.findMany({
    where: { estado: { in: ["APROBADA", "RECIBIDA"] } },
    include: { proveedor: true, pagadoPor: true },
    orderBy: { createdAt: "desc" },
  });

  const pendiente = ordenes.filter((o) => !o.pagada).reduce((acc, o) => acc + o.monto, 0);
  const pagadoEsteMes = ordenes
    .filter((o) => o.pagada && o.fechaPago && o.fechaPago >= inicioMes)
    .reduce((acc, o) => acc + o.monto, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard label="Por pagar (pendiente)" value={`$${pendiente.toLocaleString("es-MX")}`} hint="Órdenes aprobadas" />
        <KpiCard label="Pagado este mes" value={`$${pagadoEsteMes.toLocaleString("es-MX")}`} />
      </div>

      <OrdenesPagarTable ordenes={ordenes} />
    </div>
  );
}
