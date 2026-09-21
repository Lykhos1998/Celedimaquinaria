import { prisma } from "@/lib/prisma";
import { KpiCard } from "@/components/kpi-card";
import { ColaboradorForm } from "@/components/rh/colaborador-form";
import { ColaboradoresTable } from "@/components/rh/colaboradores-table";

export default async function RHPage() {
  const inicioDelDia = new Date();
  inicioDelDia.setHours(0, 0, 0, 0);

  const [colaboradores, checadasHoy, permisosPendientes, colaboradoresActivos] = await Promise.all([
    prisma.user.findMany({ orderBy: { nombre: "asc" } }),
    prisma.asistenciaRegistro.count({ where: { timestamp: { gte: inicioDelDia }, tipo: "ENTRADA" } }),
    prisma.permiso.count({ where: { estado: "SOLICITADO" } }),
    prisma.user.count({ where: { activo: true } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Colaboradores activos" value={colaboradoresActivos} />
        <KpiCard label="Entradas registradas hoy" value={checadasHoy} hint="Vigilancia" />
        <KpiCard label="Permisos pendientes" value={permisosPendientes} />
      </div>

      <ColaboradorForm />

      <ColaboradoresTable colaboradores={colaboradores} />
    </div>
  );
}
