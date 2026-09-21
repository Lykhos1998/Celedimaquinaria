import type { TipoPermiso, EstadoPermiso } from "@prisma/client";

export const TIPO_PERMISO_LABEL: Record<TipoPermiso, string> = {
  VACACIONES: "Vacaciones",
  PERMISO: "Permiso",
  INCAPACIDAD: "Incapacidad",
  OTRO: "Otro",
};

export const ESTADO_PERMISO_LABEL: Record<EstadoPermiso, string> = {
  SOLICITADO: "Solicitado",
  APROBADO: "Aprobado",
  RECHAZADO: "Rechazado",
};

export const ESTADO_PERMISO_STYLE: Record<EstadoPermiso, string> = {
  SOLICITADO: "bg-amber-500/15 text-amber-500",
  APROBADO: "bg-emerald-500/15 text-emerald-500",
  RECHAZADO: "bg-red-500/15 text-red-500",
};

export function folioPermiso(consecutivo: number) {
  return `PER-${String(consecutivo).padStart(4, "0")}`;
}

export function folioNomina(anio: number, consecutivo: number) {
  return `NOM-${anio}-${String(consecutivo).padStart(4, "0")}`;
}

// Días distintos con checada de ENTRADA dentro del periodo — no se captura a
// mano, así siempre refleja lo que Vigilancia realmente registró.
export function diasAsistidos(checadas: { timestamp: Date }[]) {
  const dias = new Set(checadas.map((c) => c.timestamp.toDateString()));
  return dias.size;
}
