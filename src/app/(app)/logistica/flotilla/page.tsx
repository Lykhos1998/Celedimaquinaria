import { prisma } from "@/lib/prisma";
import { CamionForm } from "@/components/logistica/camion-form";
import { CamionesTable } from "@/components/logistica/camiones-table";

export default async function FlotillaPage() {
  const camiones = await prisma.camion.findMany({
    include: { _count: { select: { traslados: { where: { estado: { in: ["PROGRAMADO", "EN_TRANSITO"] } } } } } },
    orderBy: { placa: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <CamionForm />
      <CamionesTable
        camiones={camiones.map((c) => ({
          id: c.id,
          placa: c.placa,
          modelo: c.modelo,
          capacidad: c.capacidad,
          activo: c.activo,
          trasladosEnCurso: c._count.traslados,
        }))}
      />
    </div>
  );
}
