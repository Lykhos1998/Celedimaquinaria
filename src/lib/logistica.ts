import { prisma } from "@/lib/prisma";
import type { EstadoTraslado, TipoMovimiento } from "@prisma/client";

export const TIPO_MOVIMIENTO_LABEL: Record<TipoMovimiento, string> = {
  ENTREGA: "Entrega",
  RECOLECCION: "Recolección",
};

export const ESTADO_TRASLADO_LABEL: Record<EstadoTraslado, string> = {
  PROGRAMADO: "Programado",
  EN_TRANSITO: "En Tránsito",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export const ESTADO_TRASLADO_STYLE: Record<EstadoTraslado, string> = {
  PROGRAMADO: "bg-slate-500/15 text-slate-400",
  EN_TRANSITO: "bg-amber-500/15 text-amber-500",
  ENTREGADO: "bg-emerald-500/15 text-emerald-500",
  CANCELADO: "bg-red-500/15 text-red-500",
};

export function folioTraslado(consecutivo: number) {
  return `TR-${String(consecutivo).padStart(4, "0")}`;
}

// Cruce con el escaneo de QR de Vigilancia (sección 3.8 de la especificación):
// una salida de camión avanza el traslado programado para esa placa a
// En Tránsito; una llegada lo cierra como Entregado. También actualiza el
// estado del equipo transportado, cerrando la transición a En Tránsito que
// hasta ahora era manual en Equipos/Flota.
export async function procesarEscaneoQR(placa: string, movimiento: "SALIDA" | "LLEGADA") {
  const camion = await prisma.camion.findUnique({ where: { placa } });
  if (!camion) return;

  if (movimiento === "SALIDA") {
    const traslado = await prisma.traslado.findFirst({
      where: { camionId: camion.id, estado: "PROGRAMADO" },
      orderBy: { fechaProgramada: "asc" },
    });
    if (!traslado) return;

    await prisma.$transaction([
      prisma.traslado.update({
        where: { id: traslado.id },
        data: { estado: "EN_TRANSITO", fechaSalida: new Date() },
      }),
      prisma.equipo.update({ where: { id: traslado.equipoId }, data: { estado: "EN_TRANSITO" } }),
    ]);
    return;
  }

  const traslado = await prisma.traslado.findFirst({
    where: { camionId: camion.id, estado: "EN_TRANSITO" },
    orderBy: { fechaSalida: "asc" },
  });
  if (!traslado) return;

  const estadoEquipoFinal = traslado.tipoMovimiento === "ENTREGA" ? "RENTADO" : "DISPONIBLE";

  await prisma.$transaction([
    prisma.traslado.update({
      where: { id: traslado.id },
      data: { estado: "ENTREGADO", fechaEntrega: new Date() },
    }),
    prisma.equipo.update({ where: { id: traslado.equipoId }, data: { estado: estadoEquipoFinal } }),
  ]);
}
