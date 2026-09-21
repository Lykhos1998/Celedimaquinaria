import { prisma } from "@/lib/prisma";
import { KpiCard } from "@/components/kpi-card";
import { NominaForm } from "@/components/rh/nomina-form";
import { NominaTable } from "@/components/rh/nomina-table";

export default async function RHNominaPage() {
  const [colaboradores, nominas] = await Promise.all([
    prisma.user.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } }),
    prisma.nomina.findMany({
      include: { colaborador: true, pagadoPor: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const pendiente = nominas.filter((n) => !n.pagada).reduce((acc, n) => acc + n.sueldoPeriodo, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard label="Nómina pendiente de pago" value={`$${pendiente.toLocaleString("es-MX")}`} />
        <KpiCard label="Recibos generados" value={nominas.length} />
      </div>

      <NominaForm colaboradores={colaboradores.map((c) => ({ id: c.id, nombre: c.nombre }))} />
      <NominaTable nominas={nominas} />
    </div>
  );
}
