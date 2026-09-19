import { prisma } from "@/lib/prisma";
import { requireAcceso } from "@/lib/access";
import { KpiCard } from "@/components/kpi-card";
import { CheckCircle2, Clock } from "lucide-react";

const ESTADO_MODULOS = [
  { label: "Vigilancia", estado: "construido" as const },
  { label: "Marketing", estado: "construido" as const },
  { label: "Ventas", estado: "construido" as const },
  { label: "Área de Daños", estado: "definido" as const },
  { label: "Compras", estado: "construido" as const },
  { label: "Taller", estado: "construido" as const },
  { label: "Finanzas", estado: "definido" as const },
  { label: "Logística", estado: "definido" as const },
  { label: "RH", estado: "definido" as const },
  { label: "Equipos / Flota", estado: "construido" as const },
  { label: "Sistemas / TI", estado: "definido" as const },
];

const ESTADO_META = {
  construido: { label: "Construido", icon: CheckCircle2, cls: "text-emerald-500" },
  definido: { label: "Definido — pendiente de construir", icon: Clock, cls: "text-amber-500" },
};

export default async function GerenciaPage() {
  await requireAcceso("gerencia");

  const inicioDelDia = new Date();
  inicioDelDia.setHours(0, 0, 0, 0);

  const [
    checadasHoy,
    camionesEnTransito,
    valesActivos,
    incidentesHoy,
    leadsActivos,
    contratosActivos,
    equiposDisponibles,
    equiposTotal,
    ordenesAbiertas,
    comprasPendientes,
  ] = await Promise.all([
    prisma.asistenciaRegistro.count({ where: { timestamp: { gte: inicioDelDia } } }),
    prisma.qRVehiculo.count({
      where: {
        timestamp: { gte: inicioDelDia },
        movimiento: "SALIDA",
      },
    }),
    prisma.valeSalida.count({ where: { estado: { in: ["SOLICITADO", "AUTORIZADO", "EN_SALIDA"] } } }),
    prisma.incidenteSeguridad.count({ where: { timestamp: { gte: inicioDelDia } } }),
    prisma.lead.count({ where: { etapa: { notIn: ["GANADO", "PERDIDO"] } } }),
    prisma.contrato.count({ where: { cancelado: false, fechaFin: { gte: inicioDelDia } } }),
    prisma.equipo.count({ where: { estado: "DISPONIBLE" } }),
    prisma.equipo.count(),
    prisma.ordenServicio.count({
      where: { estado: { in: ["ABIERTA", "EN_PROCESO", "ESPERANDO_REFACCION"] } },
    }),
    prisma.ordenCompra.count({ where: { estado: "PENDIENTE_APROBACION" } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Checadas hoy" value={checadasHoy} hint="Vigilancia" />
        <KpiCard label="Camiones en salida hoy" value={camionesEnTransito} hint="Vigilancia → Logística" />
        <KpiCard label="Vales de salida activos" value={valesActivos} hint="Sin retornar" />
        <KpiCard label="Incidentes hoy" value={incidentesHoy} hint="Bitácora de seguridad" />
        <KpiCard label="Leads en pipeline" value={leadsActivos} hint="Comercial" />
        <KpiCard label="Contratos vigentes" value={contratosActivos} hint="Comercial" />
        <KpiCard label="Unidades disponibles" value={`${equiposDisponibles} / ${equiposTotal}`} hint="Equipos / Flota" />
        <KpiCard label="Órdenes abiertas en Taller" value={ordenesAbiertas} hint="Taller" />
        <KpiCard label="Compras por aprobar" value={comprasPendientes} hint="Esperando a Dirección" />
      </div>

      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold text-foreground">Estado de módulos del sistema</h3>
          <p className="text-xs text-muted">Según la especificación funcional (versión inicial, 8 de julio de 2026)</p>
        </div>
        <ul className="divide-y divide-border">
          {ESTADO_MODULOS.map((m) => {
            const meta = ESTADO_META[m.estado];
            const Icon = meta.icon;
            return (
              <li key={m.label} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-foreground">{m.label}</span>
                <span className={`flex items-center gap-2 text-xs font-medium ${meta.cls}`}>
                  <Icon size={14} />
                  {meta.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
