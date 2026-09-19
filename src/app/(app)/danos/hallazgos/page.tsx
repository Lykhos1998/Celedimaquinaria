import { prisma } from "@/lib/prisma";
import { DanioForm } from "@/components/danos/danio-form";
import { DaniosTable } from "@/components/danos/danios-table";

export default async function HallazgosPage({
  searchParams,
}: {
  searchParams: Promise<{ reporte?: string }>;
}) {
  const { reporte } = await searchParams;

  const [reportes, danos] = await Promise.all([
    prisma.reporteInspeccion.findMany({
      include: { equipo: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.danio.findMany({
      where: reporte ? { reporteId: reporte } : {},
      include: { reporte: true, registradoPor: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <DanioForm
        reportes={reportes.map((r) => ({ id: r.id, folio: r.folio, equipoCodigo: r.equipo.codigo }))}
        reporteIdInicial={reporte}
      />
      <DaniosTable danos={danos} />
    </div>
  );
}
