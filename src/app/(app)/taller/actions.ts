"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAcceso } from "@/lib/access";
import { ESTADOS_ORDEN_ABIERTOS, folioOrdenServicio } from "@/lib/taller";
import type { EstadoOrdenServicio, TipoServicio } from "@prisma/client";

async function taller() {
  const session = await requireAcceso("taller");
  return session.user.id;
}

function revalidarTaller() {
  revalidatePath("/taller");
  revalidatePath("/taller/refacciones");
  revalidatePath("/equipos");
}

export async function crearOrden(data: { equipoId: string; tipo: TipoServicio; descripcion: string }) {
  const userId = await taller();
  const consecutivo = (await prisma.ordenServicio.count()) + 1;

  await prisma.$transaction(async (tx) => {
    await tx.ordenServicio.create({
      data: {
        folio: folioOrdenServicio(consecutivo),
        equipoId: data.equipoId,
        tipo: data.tipo,
        descripcion: data.descripcion,
        creadoPorId: userId,
      },
    });
    await tx.equipo.update({
      where: { id: data.equipoId },
      data: { estado: "EN_MANTENIMIENTO", actualizadoPorId: userId },
    });
  });

  revalidarTaller();
}

export async function actualizarEstadoOrden(ordenId: string, estado: EstadoOrdenServicio) {
  const userId = await taller();
  const orden = await prisma.ordenServicio.findUniqueOrThrow({ where: { id: ordenId } });
  const esCierre = estado === "COMPLETADA" || estado === "CANCELADA";

  await prisma.$transaction(async (tx) => {
    await tx.ordenServicio.update({
      where: { id: ordenId },
      data: { estado, ...(esCierre ? { fechaFin: new Date() } : {}) },
    });

    if (esCierre) {
      const otrasAbiertas = await tx.ordenServicio.count({
        where: {
          equipoId: orden.equipoId,
          id: { not: ordenId },
          estado: { in: ESTADOS_ORDEN_ABIERTOS },
        },
      });
      if (otrasAbiertas === 0) {
        await tx.equipo.update({
          where: { id: orden.equipoId },
          data: { estado: "DISPONIBLE", actualizadoPorId: userId },
        });
      }
    } else {
      await tx.equipo.update({
        where: { id: orden.equipoId },
        data: { estado: "EN_MANTENIMIENTO", actualizadoPorId: userId },
      });
    }
  });

  revalidarTaller();
}

export async function crearRefaccion(ordenServicioId: string, descripcion: string, cantidad: number) {
  const solicitadoPorId = await taller();
  await prisma.solicitudRefaccion.create({
    data: { ordenServicioId, descripcion, cantidad, solicitadoPorId },
  });
  revalidarTaller();
}

export async function marcarRefaccionRecibida(refaccionId: string) {
  await taller();
  await prisma.solicitudRefaccion.update({ where: { id: refaccionId }, data: { estado: "RECIBIDA" } });
  revalidarTaller();
}
