import { prisma } from "@/lib/prisma";
import { DispositivoForm } from "@/components/sistemas-ti/dispositivo-form";
import { DispositivosTable } from "@/components/sistemas-ti/dispositivos-table";

export default async function SistemasTIDispositivosPage() {
  const [colaboradores, dispositivos] = await Promise.all([
    prisma.user.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } }),
    prisma.dispositivo.findMany({
      where: { activo: true },
      include: { colaborador: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const colaboradorOptions = colaboradores.map((c) => ({ id: c.id, nombre: c.nombre }));

  return (
    <div className="flex flex-col gap-6">
      <DispositivoForm colaboradores={colaboradorOptions} />
      <DispositivosTable dispositivos={dispositivos} colaboradores={colaboradorOptions} />
    </div>
  );
}
