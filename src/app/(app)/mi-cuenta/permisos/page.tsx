import { prisma } from "@/lib/prisma";
import { requireSesion } from "@/lib/access";
import { MiPermisoForm } from "@/components/mi-cuenta/mi-permiso-form";
import { MisPermisosTable } from "@/components/mi-cuenta/mis-permisos-table";

export default async function MiCuentaPermisosPage() {
  const session = await requireSesion();

  const permisos = await prisma.permiso.findMany({
    where: { colaboradorId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <MiPermisoForm />
      <MisPermisosTable permisos={permisos} />
    </div>
  );
}
