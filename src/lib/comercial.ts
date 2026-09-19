import type { CanalLead, EtapaLead, Temperatura, TipoTrabajo } from "@prisma/client";

export const CANAL_LABEL: Record<CanalLead, string> = {
  REDES_SOCIALES: "Redes Sociales",
  COTIZACION_DIRECTA: "Cotización Directa",
  TELEFONO: "Teléfono",
  FORMULARIO_WEB: "Formulario Web",
};

export const TIPO_TRABAJO_LABEL: Record<TipoTrabajo, string> = {
  RENTA: "Renta",
  VENTA: "Venta",
};

export const TEMPERATURA_LABEL: Record<Temperatura, string> = {
  FRIO: "Frío",
  TIBIO: "Tibio",
  CALIENTE: "Caliente",
};

export const TEMPERATURA_STYLE: Record<Temperatura, string> = {
  FRIO: "bg-sky-500/15 text-sky-500",
  TIBIO: "bg-amber-500/15 text-amber-500",
  CALIENTE: "bg-red-500/15 text-red-500",
};

// Etapas del pipeline pre-venta, en orden. GANADO/PERDIDO son cierres, no
// columnas del kanban de trabajo activo.
export const ETAPAS_PIPELINE: EtapaLead[] = [
  "LEAD_NUEVO",
  "CALIFICADO",
  "CONTACTADO",
  "PROPUESTA",
  "NEGOCIACION",
];

export const ETAPA_LABEL: Record<EtapaLead, string> = {
  LEAD_NUEVO: "Lead Nuevo",
  CALIFICADO: "Calificado",
  CONTACTADO: "Contactado",
  PROPUESTA: "Propuesta",
  NEGOCIACION: "Negociación",
  GANADO: "Ganado",
  PERDIDO: "Perdido",
};

// Probabilidad de cierre fija por etapa, usada para el pronóstico ponderado
// del dashboard de Marketing (heurística simple, no un modelo estadístico).
export const PROBABILIDAD_ETAPA: Record<EtapaLead, number> = {
  LEAD_NUEVO: 0.1,
  CALIFICADO: 0.25,
  CONTACTADO: 0.4,
  PROPUESTA: 0.6,
  NEGOCIACION: 0.8,
  GANADO: 1,
  PERDIDO: 0,
};

export type EstadoContrato = "EN_FIRMA" | "ACTIVO" | "POR_VENCER" | "TERMINADO" | "CANCELADO";

export const ESTADO_CONTRATO_LABEL: Record<EstadoContrato, string> = {
  EN_FIRMA: "En Firma",
  ACTIVO: "Contrato Activo",
  POR_VENCER: "Por Vencer",
  TERMINADO: "Contrato Terminado",
  CANCELADO: "Cancelado",
};

export const ESTADO_CONTRATO_STYLE: Record<EstadoContrato, string> = {
  EN_FIRMA: "bg-slate-500/15 text-slate-400",
  ACTIVO: "bg-emerald-500/15 text-emerald-500",
  POR_VENCER: "bg-amber-500/15 text-amber-500",
  TERMINADO: "bg-muted/20 text-muted",
  CANCELADO: "bg-red-500/15 text-red-500",
};

const DIAS_ALERTA_VENCIMIENTO = 15;

// El ciclo post-venta se deriva de las fechas del contrato, no se guarda
// manualmente: así siempre refleja el estado real sin un job aparte.
export function estadoContrato(c: {
  cancelado: boolean;
  fechaInicio: Date;
  fechaFin: Date;
}): EstadoContrato {
  if (c.cancelado) return "CANCELADO";

  const ahora = new Date();
  if (ahora < c.fechaInicio) return "EN_FIRMA";
  if (ahora > c.fechaFin) return "TERMINADO";

  const diasParaVencer = (c.fechaFin.getTime() - ahora.getTime()) / 86_400_000;
  if (diasParaVencer <= DIAS_ALERTA_VENCIMIENTO) return "POR_VENCER";
  return "ACTIVO";
}

// Comisión estimada del asesor: 5% del valor mensual del contrato.
const TASA_COMISION = 0.05;
export function comisionEstimada(valorMensual: number) {
  return valorMensual * TASA_COMISION;
}

export function folioLead(consecutivo: number) {
  return `EXP-${String(consecutivo).padStart(4, "0")}`;
}

export function folioContrato(anio: number, consecutivo: number) {
  return `CTR-${anio}-${String(consecutivo).padStart(4, "0")}`;
}
