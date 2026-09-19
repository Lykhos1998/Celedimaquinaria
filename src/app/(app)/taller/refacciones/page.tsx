import { prisma } from "@/lib/prisma";
import { RefaccionForm } from "@/components/taller/refaccion-form";
import { RefaccionesTable } from "@/components/taller/refacciones-table";
import { ESTADOS_ORDEN_ABIERTOS } from "@/lib/taller";

export default async function RefaccionesPage({
  searchParams,
}: {
  searchParams: Promise<{ orden?: string }>;
}) {
  const { orden } = await searchParams;

  const [ordenesAbiertas, refacciones] = await Promise.all([
    prisma.ordenServicio.findMany({
      where: { estado: { in: ESTADOS_ORDEN_ABIERTOS } },
      include: { equipo: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.solicitudRefaccion.findMany({
      where: orden ? { ordenServicioId: orden } : {},
      include: { ordenServicio: true, solicitadoPor: true, ordenCompra: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <RefaccionForm
        ordenes={ordenesAbiertas.map((o) => ({ id: o.id, folio: o.folio, equipoCodigo: o.equipo.codigo }))}
        ordenIdInicial={orden}
      />
      <RefaccionesTable refacciones={refacciones} />
    </div>
  );
}
