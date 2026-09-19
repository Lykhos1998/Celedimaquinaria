import type { Combustible, EstadoEquipo } from "@prisma/client";

export const ESTADO_EQUIPO_LABEL: Record<EstadoEquipo, string> = {
  DISPONIBLE: "Disponible",
  RENTADO: "Rentado",
  EN_TRANSITO: "En Tránsito",
  EN_MANTENIMIENTO: "En Mantenimiento",
  FUERA_DE_SERVICIO: "Fuera de Servicio",
};

export const ESTADO_EQUIPO_STYLE: Record<EstadoEquipo, string> = {
  DISPONIBLE: "bg-emerald-500/15 text-emerald-500",
  RENTADO: "bg-blue-500/15 text-blue-500",
  EN_TRANSITO: "bg-amber-500/15 text-amber-500",
  EN_MANTENIMIENTO: "bg-orange-500/15 text-orange-500",
  FUERA_DE_SERVICIO: "bg-red-500/15 text-red-500",
};

export const COMBUSTIBLE_LABEL: Record<Combustible, string> = {
  DIESEL: "Diésel",
  GASOLINA: "Gasolina",
  ELECTRICO: "Eléctrico",
  GAS: "Gas",
};

export function folioEquipo(consecutivo: number) {
  return `EQ-${String(consecutivo).padStart(4, "0")}`;
}
