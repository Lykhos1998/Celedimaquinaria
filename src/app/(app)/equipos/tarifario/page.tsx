import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TarifaForm } from "@/components/equipos/tarifa-form";

export default async function TarifarioPage() {
  const session = await auth();
  const puedeEditarTarifas = session?.user.rol === "GERENCIA" || session?.user.rol === "ASESOR_VENTAS";

  const tarifas = await prisma.tarifaEquipo.findMany({
    include: { _count: { select: { equipos: true } } },
    orderBy: [{ marca: "asc" }, { modelo: "asc" }],
  });

  return (
    <div className="flex flex-col gap-6">
      {puedeEditarTarifas ? (
        <TarifaForm />
      ) : (
        <p className="rounded-xl border border-border bg-surface px-5 py-4 text-sm text-muted">
          Solo Ventas o Gerencia pueden definir tarifas de renta.
        </p>
      )}

      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold text-foreground">Tarifario</h3>
        </div>
        {tarifas.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">Sin tarifas registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted">
                  <th className="px-5 py-2 font-medium">Marca / Modelo</th>
                  <th className="px-5 py-2 font-medium">Clasificación</th>
                  <th className="px-5 py-2 font-medium">Altura / capacidad</th>
                  <th className="px-5 py-2 font-medium">Mensual</th>
                  <th className="px-5 py-2 font-medium">Día 1</th>
                  <th className="px-5 py-2 font-medium">Día 7</th>
                  <th className="px-5 py-2 font-medium">Día 15</th>
                  <th className="px-5 py-2 font-medium">Unidades</th>
                </tr>
              </thead>
              <tbody>
                {tarifas.map((t) => (
                  <tr key={t.id} className="border-t border-border">
                    <td className="px-5 py-2 text-foreground">
                      {t.marca} {t.modelo}
                    </td>
                    <td className="px-5 py-2 text-muted">{t.clasificacion}</td>
                    <td className="px-5 py-2 text-muted">{t.alturaCapacidad ?? "—"}</td>
                    <td className="px-5 py-2 text-muted">${t.precioMensual.toLocaleString("es-MX")}</td>
                    <td className="px-5 py-2 text-muted">${t.precioDia1.toLocaleString("es-MX")}</td>
                    <td className="px-5 py-2 text-muted">${t.precioDia7.toLocaleString("es-MX")}</td>
                    <td className="px-5 py-2 text-muted">${t.precioDia15.toLocaleString("es-MX")}</td>
                    <td className="px-5 py-2 text-muted">{t._count.equipos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
