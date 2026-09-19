import type { AreaSolicitante, EstadoOrdenCompra } from "@prisma/client";

export const ESTADO_OC_LABEL: Record<EstadoOrdenCompra, string> = {
  PENDIENTE_APROBACION: "Pendiente de aprobación",
  APROBADA: "Aprobada",
  RECHAZADA: "Rechazada",
  RECIBIDA: "Recibida",
};

export const ESTADO_OC_STYLE: Record<EstadoOrdenCompra, string> = {
  PENDIENTE_APROBACION: "bg-amber-500/15 text-amber-500",
  APROBADA: "bg-blue-500/15 text-blue-500",
  RECHAZADA: "bg-red-500/15 text-red-500",
  RECIBIDA: "bg-emerald-500/15 text-emerald-500",
};

export const AREA_LABEL: Record<AreaSolicitante, string> = {
  TALLER: "Taller",
  RH: "RH",
  SISTEMAS_TI: "Sistemas / TI",
  OTRO: "Otro",
};

export function folioOrdenCompra(anio: number, consecutivo: number) {
  return `OC-${anio}-${String(consecutivo).padStart(4, "0")}`;
}
