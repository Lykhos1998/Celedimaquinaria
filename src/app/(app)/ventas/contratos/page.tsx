import { prisma } from "@/lib/prisma";
import { ContratosTable } from "@/components/ventas/contratos-table";
import { estadoContrato } from "@/lib/comercial";

export default async function ContratosPage() {
  const contratos = await prisma.contrato.findMany({
    include: {
      lead: true,
      asesor: true,
      equipo: true,
      reportesInspeccion: { include: { danos: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <ContratosTable
      contratos={contratos.map((c) => ({
        ...c,
        estado: estadoContrato(c),
        costoDanos: c.reportesInspeccion.reduce(
          (acc, r) => acc + r.danos.reduce((a, d) => a + (d.costoEstimado ?? 0), 0),
          0,
        ),
      }))}
    />
  );
}
