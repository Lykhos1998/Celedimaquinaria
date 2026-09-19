import type { EstadoOrdenServicio, EstadoRefaccion, TipoServicio } from "@prisma/client";

export const TIPO_SERVICIO_LABEL: Record<TipoServicio, string> = {
  PREVENTIVO: "Preventivo",
  CORRECTIVO: "Correctivo",
};

export const ESTADO_ORDEN_LABEL: Record<EstadoOrdenServicio, string> = {
  ABIERTA: "Abierta",
  EN_PROCESO: "En Proceso",
  ESPERANDO_REFACCION: "Esperando Refacción",
  COMPLETADA: "Completada",
  CANCELADA: "Cancelada",
};

export const ESTADO_ORDEN_STYLE: Record<EstadoOrdenServicio, string> = {
  ABIERTA: "bg-slate-500/15 text-slate-400",
  EN_PROCESO: "bg-blue-500/15 text-blue-500",
  ESPERANDO_REFACCION: "bg-amber-500/15 text-amber-500",
  COMPLETADA: "bg-emerald-500/15 text-emerald-500",
  CANCELADA: "bg-red-500/15 text-red-500",
};

// Órdenes en estos estados mantienen al equipo en EN_MANTENIMIENTO.
export const ESTADOS_ORDEN_ABIERTOS: EstadoOrdenServicio[] = [
  "ABIERTA",
  "EN_PROCESO",
  "ESPERANDO_REFACCION",
];

export const ESTADO_REFACCION_LABEL: Record<EstadoRefaccion, string> = {
  SOLICITADA: "Solicitada",
  RECIBIDA: "Recibida",
  CANCELADA: "Cancelada",
};

export const ESTADO_REFACCION_STYLE: Record<EstadoRefaccion, string> = {
  SOLICITADA: "bg-amber-500/15 text-amber-500",
  RECIBIDA: "bg-emerald-500/15 text-emerald-500",
  CANCELADA: "bg-red-500/15 text-red-500",
};

export function folioOrdenServicio(consecutivo: number) {
  return `OS-${String(consecutivo).padStart(4, "0")}`;
}
