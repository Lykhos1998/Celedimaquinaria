import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { KpiCard } from "@/components/kpi-card";
import { EquipoForm } from "@/components/equipos/equipo-form";
import { EquiposTable } from "@/components/equipos/equipos-table";
import { COMBUSTIBLE_LABEL, ESTADO_EQUIPO_LABEL } from "@/lib/equipos";
import type { Combustible, EstadoEquipo, Prisma } from "@prisma/client";

const ESTADOS = Object.keys(ESTADO_EQUIPO_LABEL) as EstadoEquipo[];
const COMBUSTIBLES = Object.keys(COMBUSTIBLE_LABEL) as Combustible[];

export default async function EquiposCatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; estado?: string; categoria?: string; combustible?: string }>;
}) {
  const { q, estado, categoria, combustible } = await searchParams;

  const where: Prisma.EquipoWhereInput = {
    ...(q
      ? {
          OR: [
            { codigo: { contains: q } },
            { marca: { contains: q } },
            { modelo: { contains: q } },
            { numeroSerie: { contains: q } },
          ],
        }
      : {}),
    ...(estado ? { estado: estado as EstadoEquipo } : {}),
    ...(categoria ? { categoria } : {}),
    ...(combustible ? { combustible: combustible as Combustible } : {}),
  };

  const [equipos, tarifas, categorias, conteoPorEstado] = await Promise.all([
    prisma.equipo.findMany({ where, include: { tarifa: true }, orderBy: { codigo: "asc" } }),
    prisma.tarifaEquipo.findMany({ orderBy: { marca: "asc" } }),
    prisma.equipo.findMany({ select: { categoria: true }, distinct: ["categoria"] }),
    prisma.equipo.groupBy({ by: ["estado"], _count: { _all: true } }),
  ]);

  const conteoMap = new Map(conteoPorEstado.map((c) => [c.estado, c._count._all]));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {ESTADOS.map((e) => (
          <KpiCard key={e} label={ESTADO_EQUIPO_LABEL[e]} value={conteoMap.get(e) ?? 0} />
        ))}
      </div>

      <EquipoForm
        tarifas={tarifas.map((t) => ({ id: t.id, marca: t.marca, modelo: t.modelo, clasificacion: t.clasificacion }))}
      />

      <form className="flex flex-wrap items-end gap-2 rounded-xl border border-border bg-surface p-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Buscar</label>
          <input
            name="q"
            defaultValue={q}
            placeholder="Código, marca, modelo, serie"
            className="rounded-md border border-border bg-surface-muted px-3 py-1.5 text-sm text-foreground outline-none focus:border-brand"
          />
        </div>
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
                {ESTADO_EQUIPO_LABEL[e]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Categoría</label>
          <select
            name="categoria"
            defaultValue={categoria ?? ""}
            className="rounded-md border border-border bg-surface-muted px-3 py-1.5 text-sm text-foreground outline-none focus:border-brand"
          >
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.categoria} value={c.categoria}>
                {c.categoria}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Combustible</label>
          <select
            name="combustible"
            defaultValue={combustible ?? ""}
            className="rounded-md border border-border bg-surface-muted px-3 py-1.5 text-sm text-foreground outline-none focus:border-brand"
          >
            <option value="">Todos</option>
            {COMBUSTIBLES.map((c) => (
              <option key={c} value={c}>
                {COMBUSTIBLE_LABEL[c]}
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
        <Link href="/equipos" className="text-xs text-muted underline hover:text-foreground">
          Limpiar
        </Link>
      </form>

      <EquiposTable
        equipos={equipos.map((e) => ({
          id: e.id,
          codigo: e.codigo,
          marca: e.marca,
          modelo: e.modelo,
          anio: e.anio,
          numeroSerie: e.numeroSerie,
          categoria: e.categoria,
          combustible: e.combustible,
          altura: e.altura,
          horometro: e.horometro,
          estado: e.estado,
          tarifaLabel: e.tarifa ? `${e.tarifa.clasificacion} — $${e.tarifa.precioMensual.toLocaleString("es-MX")}/mes` : null,
        }))}
      />
    </div>
  );
}
