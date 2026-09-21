import type { CategoriaTicket, PrioridadTicket, EstadoTicket, TipoDispositivo } from "@prisma/client";

export const CATEGORIA_TICKET_LABEL: Record<CategoriaTicket, string> = {
  HARDWARE: "Hardware",
  SOFTWARE: "Software",
  RED: "Red",
  OTRO: "Otro",
};

export const PRIORIDAD_TICKET_LABEL: Record<PrioridadTicket, string> = {
  BAJA: "Baja",
  MEDIA: "Media",
  ALTA: "Alta",
};

export const PRIORIDAD_TICKET_STYLE: Record<PrioridadTicket, string> = {
  BAJA: "bg-slate-500/15 text-slate-400",
  MEDIA: "bg-amber-500/15 text-amber-500",
  ALTA: "bg-red-500/15 text-red-500",
};

export const ESTADO_TICKET_LABEL: Record<EstadoTicket, string> = {
  ABIERTO: "Abierto",
  RESUELTO: "Resuelto",
};

export const ESTADO_TICKET_STYLE: Record<EstadoTicket, string> = {
  ABIERTO: "bg-amber-500/15 text-amber-500",
  RESUELTO: "bg-emerald-500/15 text-emerald-500",
};

export const TIPO_DISPOSITIVO_LABEL: Record<TipoDispositivo, string> = {
  LAPTOP: "Laptop",
  DESKTOP: "Desktop",
  MONITOR: "Monitor",
  CELULAR: "Celular",
  OTRO: "Otro",
};

export function folioTicket(consecutivo: number) {
  return `TK-${String(consecutivo).padStart(4, "0")}`;
}

export function folioDispositivo(anio: number, consecutivo: number) {
  return `DI-${anio}-${String(consecutivo).padStart(3, "0")}`;
}
