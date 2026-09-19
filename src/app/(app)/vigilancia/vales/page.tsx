import { prisma } from "@/lib/prisma";
import { ValeForm } from "@/components/vigilancia/vale-form";
import { ValesTable } from "@/components/vigilancia/vales-table";

export default async function ValesSalidaPage() {
  const [colaboradores, vales] = await Promise.all([
    prisma.user.findMany({
      where: { activo: true },
      select: { id: true, nombre: true },
      orderBy: { nombre: "asc" },
    }),
    prisma.valeSalida.findMany({
      include: { solicitante: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <ValeForm colaboradores={colaboradores} />
      <ValesTable vales={vales} />
    </div>
  );
}
