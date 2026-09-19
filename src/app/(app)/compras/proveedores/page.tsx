import { prisma } from "@/lib/prisma";
import { ProveedorForm } from "@/components/compras/proveedor-form";

export default async function ProveedoresPage() {
  const proveedores = await prisma.proveedor.findMany({
    include: { _count: { select: { ordenesCompra: true } } },
    orderBy: { nombre: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <ProveedorForm />

      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold text-foreground">Proveedores</h3>
        </div>
        {proveedores.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">Sin proveedores registrados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium">Nombre</th>
                <th className="px-5 py-2 font-medium">Contacto</th>
                <th className="px-5 py-2 font-medium">Teléfono</th>
                <th className="px-5 py-2 font-medium">Correo</th>
                <th className="px-5 py-2 font-medium">Categoría</th>
                <th className="px-5 py-2 font-medium">Órdenes</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-5 py-2 text-foreground">{p.nombre}</td>
                  <td className="px-5 py-2 text-muted">{p.contacto ?? "—"}</td>
                  <td className="px-5 py-2 text-muted">{p.telefono ?? "—"}</td>
                  <td className="px-5 py-2 text-muted">{p.email ?? "—"}</td>
                  <td className="px-5 py-2 text-muted">{p.categoria ?? "—"}</td>
                  <td className="px-5 py-2 text-muted">{p._count.ordenesCompra}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
