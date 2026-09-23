import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PermisoForm } from "@/components/rh/permiso-form";
import { PermisosTable } from "@/components/rh/permisos-table";

export default async function RHPermisosPage() {
  const session = await auth();
  const [colaboradores, permisos] = await Promise.all([
    prisma.user.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } }),
    prisma.permiso.findMany({
      include: { colaborador: true, resueltoPor: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PermisoForm colaboradores={colaboradores.map((c) => ({ id: c.id, nombre: c.nombre }))} />
      <PermisosTable permisos={permisos} sessionUserId={session?.user.id ?? ""} />
    </div>
  );
}
