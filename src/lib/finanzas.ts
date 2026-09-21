import type { ConceptoCobro } from "@prisma/client";

export const CONCEPTO_COBRO_LABEL: Record<ConceptoCobro, string> = {
  RENTA_MENSUAL: "Renta mensual",
  DANO: "Daño",
  OTRO: "Otro",
};

export type EstadoCuentaCobrar = "PENDIENTE" | "VENCIDA" | "COBRADA";

export const ESTADO_CXC_LABEL: Record<EstadoCuentaCobrar, string> = {
  PENDIENTE: "Pendiente",
  VENCIDA: "Vencida",
  COBRADA: "Cobrada",
};

export const ESTADO_CXC_STYLE: Record<EstadoCuentaCobrar, string> = {
  PENDIENTE: "bg-amber-500/15 text-amber-500",
  VENCIDA: "bg-red-500/15 text-red-500",
  COBRADA: "bg-emerald-500/15 text-emerald-500",
};

// Igual que estadoContrato en lib/comercial.ts: se deriva de la fecha, no se
// guarda manualmente, así siempre refleja el estado real sin un job aparte.
export function estadoCuentaCobrar(c: { cobrada: boolean; fechaVencimiento: Date }): EstadoCuentaCobrar {
  if (c.cobrada) return "COBRADA";
  if (new Date() > c.fechaVencimiento) return "VENCIDA";
  return "PENDIENTE";
}

export function folioCuentaCobrar(anio: number, consecutivo: number) {
  return `CXC-${anio}-${String(consecutivo).padStart(4, "0")}`;
}
