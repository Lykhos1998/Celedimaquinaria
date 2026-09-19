import type { SeveridadDanio } from "@prisma/client";

export const SEVERIDAD_DANIO_LABEL: Record<SeveridadDanio, string> = {
  LEVE: "Leve",
  MODERADA: "Moderada",
  GRAVE: "Grave",
};

export const SEVERIDAD_DANIO_STYLE: Record<SeveridadDanio, string> = {
  LEVE: "bg-slate-500/15 text-slate-400",
  MODERADA: "bg-amber-500/15 text-amber-500",
  GRAVE: "bg-red-500/15 text-red-500",
};

export function folioReporteInspeccion(consecutivo: number) {
  return `INS-${String(consecutivo).padStart(4, "0")}`;
}
