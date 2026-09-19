import { prisma } from "@/lib/prisma";
import { KpiCard } from "@/components/kpi-card";
import { TrasladoForm } from "@/components/logistica/traslado-form";
import { TrasladosTable } from "@/components/logistica/traslados-table";
import { ESTADO_TRASLADO_LABEL } from "@/lib/logistica";
import type { EstadoTraslado } from "@prisma/client";

const ESTADOS = Object.keys(ESTADO_TRASLADO_LABEL) as EstadoTraslado[];

export default async function TrasladosPage() {
  const [equipos, camiones, traslados, conteoPorEstado] = await Promise.all([
    prisma.equipo.findMany({
      orderBy: { codigo: "asc" },
      select: { id: true, codigo: true, marca: true, modelo: true },
    }),
    prisma.camion.findMany({
      where: { activo: true },
      orderBy: { placa: "asc" },
      select: { id: true, placa: true, modelo: true },
    }),
    prisma.traslado.findMany({
      include: { equipo: true, camion: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.traslado.groupBy({ by: ["estado"], _count: { _all: true } }),
  ]);

  const conteoMap = new Map(conteoPorEstado.map((c) => [c.estado, c._count._all]));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ESTADOS.map((e) => (
          <KpiCard key={e} label={ESTADO_TRASLADO_LABEL[e]} value={conteoMap.get(e) ?? 0} />
        ))}
      </div>

      <TrasladoForm equipos={equipos} camiones={camiones} />
      <TrasladosTable traslados={traslados} />
    </div>
  );
}
