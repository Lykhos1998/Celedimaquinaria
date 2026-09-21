import { prisma } from "@/lib/prisma";
import { ValeDispositivoForm } from "@/components/sistemas-ti/vale-dispositivo-form";
import { ValesDispositivoTable } from "@/components/sistemas-ti/vales-dispositivo-table";

export default async function SistemasTIValesPage() {
  const [dispositivosAsignados, vales] = await Promise.all([
    prisma.dispositivo.findMany({
      where: { activo: true, colaboradorId: { not: null } },
      include: { colaborador: true },
      orderBy: { codigo: "asc" },
    }),
    prisma.valeSalida.findMany({
      where: { dispositivoId: { not: null } },
      include: { solicitante: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <ValeDispositivoForm
        dispositivos={dispositivosAsignados
          .filter((d) => d.colaborador)
          .map((d) => ({
            id: d.id,
            codigo: d.codigo,
            marca: d.marca,
            modelo: d.modelo,
            colaboradorId: d.colaborador!.id,
            colaboradorNombre: d.colaborador!.nombre,
          }))}
      />
      <ValesDispositivoTable vales={vales} />
    </div>
  );
}
