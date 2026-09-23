import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { KpiCard } from "@/components/kpi-card";
import { OrdenCompraForm } from "@/components/compras/orden-compra-form";
import { OrdenesCompraTable } from "@/components/compras/ordenes-compra-table";
import { ESTADO_OC_LABEL } from "@/lib/compras";
import type { EstadoOrdenCompra } from "@prisma/client";

const ESTADOS = Object.keys(ESTADO_OC_LABEL) as EstadoOrdenCompra[];

export default async function ComprasPage() {
  const session = await auth();

  const [refaccionesPendientes, proveedores, ordenes, conteoPorEstado] = await Promise.all([
    prisma.solicitudRefaccion.findMany({
      where: { estado: "SOLICITADA", ordenCompra: null },
      include: { ordenServicio: { include: { equipo: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.proveedor.findMany({ orderBy: { nombre: "asc" } }),
    prisma.ordenCompra.findMany({
      include: {
        proveedor: true,
        registradoPor: true,
        aprobadoPor: true,
        refaccion: { include: { ordenServicio: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.ordenCompra.groupBy({ by: ["estado"], _count: { _all: true } }),
  ]);

  const conteoMap = new Map(conteoPorEstado.map((c) => [c.estado, c._count._all]));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ESTADOS.map((e) => (
          <KpiCard key={e} label={ESTADO_OC_LABEL[e]} value={conteoMap.get(e) ?? 0} />
        ))}
      </div>

      {refaccionesPendientes.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <h3 className="text-sm font-semibold text-amber-500">
            Solicitudes de Taller sin cotizar ({refaccionesPendientes.length})
          </h3>
          <ul className="mt-3 space-y-1 text-sm">
            {refaccionesPendientes.map((r) => (
              <li key={r.id} className="flex justify-between text-foreground">
                <span>
                  {r.ordenServicio.folio} — {r.descripcion} (x{r.cantidad})
                </span>
                <span className="text-muted">{r.ordenServicio.equipo.codigo}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <OrdenCompraForm
        refacciones={refaccionesPendientes.map((r) => ({
          id: r.id,
          descripcion: r.descripcion,
          cantidad: r.cantidad,
          ordenFolio: r.ordenServicio.folio,
          equipoCodigo: r.ordenServicio.equipo.codigo,
        }))}
        proveedores={proveedores.map((p) => ({ id: p.id, nombre: p.nombre }))}
      />

      <OrdenesCompraTable
        ordenes={ordenes}
        esDireccion={session?.user.rol === "GERENCIA"}
        sessionUserId={session?.user.id ?? ""}
      />
    </div>
  );
}
