import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { KpiCard } from "@/components/kpi-card";
import { OrdenForm } from "@/components/taller/orden-form";
import { OrdenesTable } from "@/components/taller/ordenes-table";
import { ESTADOS_ORDEN_ABIERTOS, ESTADO_ORDEN_LABEL, TIPO_SERVICIO_LABEL } from "@/lib/taller";
import type { EstadoOrdenServicio, Prisma, TipoServicio } from "@prisma/client";

const ESTADOS = Object.keys(ESTADO_ORDEN_LABEL) as EstadoOrdenServicio[];
const TIPOS = Object.keys(TIPO_SERVICIO_LABEL) as TipoServicio[];

export default async function OrdenesServicioPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; tipo?: string; equipoId?: string }>;
}) {
  const { estado, tipo, equipoId } = await searchParams;

  const where: Prisma.OrdenServicioWhereInput = {
    ...(estado ? { estado: estado as EstadoOrdenServicio } : {}),
    ...(tipo ? { tipo: tipo as TipoServicio } : {}),
    ...(equipoId ? { equipoId } : {}),
  };

  const [ordenes, equiposElegibles, conteoPorEstado, equipoFiltrado] = await Promise.all([
    prisma.ordenServicio.findMany({
      where,
      include: { equipo: true, refacciones: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.equipo.findMany({
      where: { ordenesServicio: { none: { estado: { in: ESTADOS_ORDEN_ABIERTOS } } } },
      orderBy: { codigo: "asc" },
      select: { id: true, codigo: true, marca: true, modelo: true },
    }),
    prisma.ordenServicio.groupBy({ by: ["estado"], _count: { _all: true } }),
    equipoId ? prisma.equipo.findUnique({ where: { id: equipoId }, select: { codigo: true } }) : null,
  ]);

  const conteoMap = new Map(conteoPorEstado.map((c) => [c.estado, c._count._all]));

  return (
    <div className="flex flex-col gap-6">
      {equipoFiltrado && (
        <div className="flex items-center justify-between rounded-md border border-border bg-surface-muted px-4 py-2 text-sm">
          <span className="text-foreground">
            Historial de la unidad <strong>{equipoFiltrado.codigo}</strong>
          </span>
          <Link href="/taller" className="text-xs text-muted underline hover:text-foreground">
            Ver todas las órdenes
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {ESTADOS.map((e) => (
          <KpiCard key={e} label={ESTADO_ORDEN_LABEL[e]} value={conteoMap.get(e) ?? 0} />
        ))}
      </div>

      <OrdenForm equipos={equiposElegibles} />

      <form className="flex flex-wrap items-end gap-2 rounded-xl border border-border bg-surface p-4">
        {equipoId && <input type="hidden" name="equipoId" value={equipoId} />}
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Estado</label>
          <select
            name="estado"
            defaultValue={estado ?? ""}
            className="rounded-md border border-border bg-surface-muted px-3 py-1.5 text-sm text-foreground outline-none focus:border-brand"
          >
            <option value="">Todos</option>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {ESTADO_ORDEN_LABEL[e]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Tipo</label>
          <select
            name="tipo"
            defaultValue={tipo ?? ""}
            className="rounded-md border border-border bg-surface-muted px-3 py-1.5 text-sm text-foreground outline-none focus:border-brand"
          >
            <option value="">Todos</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {TIPO_SERVICIO_LABEL[t]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:border-brand hover:text-brand"
        >
          Filtrar
        </button>
        <Link href="/taller" className="text-xs text-muted underline hover:text-foreground">
          Limpiar
        </Link>
      </form>

      <OrdenesTable
        ordenes={ordenes.map((o) => ({
          id: o.id,
          folio: o.folio,
          tipo: o.tipo,
          descripcion: o.descripcion,
          estado: o.estado,
          fechaInicio: o.fechaInicio,
          fechaFin: o.fechaFin,
          equipo: o.equipo,
          refaccionesPendientes: o.refacciones.filter((r) => r.estado === "SOLICITADA").length,
        }))}
      />
    </div>
  );
}
