import { Rol } from "@prisma/client";

export type ModuloSlug =
  | "vigilancia"
  | "marketing"
  | "ventas"
  | "danos"
  | "compras"
  | "taller"
  | "finanzas"
  | "logistica"
  | "rh"
  | "equipos"
  | "sistemas-ti"
  | "gerencia";

export const MODULOS: Record<
  ModuloSlug,
  { label: string; implementado: boolean }
> = {
  vigilancia: { label: "Vigilancia", implementado: true },
  marketing: { label: "Marketing", implementado: true },
  ventas: { label: "Ventas", implementado: true },
  danos: { label: "Área de Daños", implementado: false },
  compras: { label: "Compras", implementado: true },
  taller: { label: "Taller", implementado: true },
  finanzas: { label: "Finanzas", implementado: false },
  logistica: { label: "Logística", implementado: false },
  rh: { label: "RH", implementado: false },
  equipos: { label: "Equipos / Flota", implementado: true },
  "sistemas-ti": { label: "Sistemas / TI", implementado: false },
  gerencia: { label: "Gerencia", implementado: true },
};

// Módulos visibles por rol, según la sección 5 (Roles y permisos) de la
// especificación funcional. GERENCIA ve todos los módulos.
export const MODULOS_POR_ROL: Record<Rol, ModuloSlug[]> = {
  VIGILANTE: ["vigilancia"],
  MARKETING: ["marketing", "ventas"],
  ASESOR_VENTAS: ["ventas", "equipos"],
  INSPECTOR_DANOS: ["danos"],
  COMPRAS: ["compras", "equipos"],
  TALLER: ["taller", "equipos"],
  FINANZAS: ["finanzas"],
  LOGISTICA: ["logistica", "equipos"],
  RH: ["rh"],
  SISTEMAS_TI: ["sistemas-ti"],
  GERENCIA: Object.keys(MODULOS) as ModuloSlug[],
};

export const ROL_LABEL: Record<Rol, string> = {
  VIGILANTE: "Vigilante",
  MARKETING: "Marketing",
  ASESOR_VENTAS: "Asesor de Ventas",
  INSPECTOR_DANOS: "Inspector de Daños",
  COMPRAS: "Compras",
  TALLER: "Taller",
  FINANZAS: "Finanzas",
  LOGISTICA: "Logística",
  RH: "RH",
  SISTEMAS_TI: "Sistemas / TI",
  GERENCIA: "Gerencia / Admin",
};

// Primer módulo al que se redirige un usuario tras iniciar sesión.
export function moduloInicial(rol: Rol): ModuloSlug {
  if (rol === "GERENCIA") return "gerencia";
  return MODULOS_POR_ROL[rol][0];
}
