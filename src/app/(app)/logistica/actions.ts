"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAcceso } from "@/lib/access";
import { folioTraslado } from "@/lib/logistica";
import type { TipoMovimiento } from "@prisma/client";

async function logistica() {
  const session = await requireAcceso("logistica");
  return session.user.id;
}

function revalidarLogistica() {
  revalidatePath("/logistica");
  revalidatePath("/logistica/flotilla");
  revalidatePath("/equipos");
}

export async function crearTraslado(data: {
  equipoId: string;
  camionId: string;
  tipoMovimiento: TipoMovimiento;
  origen: string;
  destino: string;
  fechaProgramada: string;
}) {
  const programadoPorId = await logistica();
  const consecutivo = (await prisma.traslado.count()) + 1;

  await prisma.traslado.create({
    data: {
      folio: folioTraslado(consecutivo),
      equipoId: data.equipoId,
      camionId: data.camionId,
      tipoMovimiento: data.tipoMovimiento,
      origen: data.origen,
      destino: data.destino,
      fechaProgramada: new Date(data.fechaProgramada),
      programadoPorId,
    },
  });

  revalidarLogistica();
}

export async function cancelarTraslado(id: string) {
  await logistica();
  await prisma.traslado.update({ where: { id }, data: { estado: "CANCELADO" } });
  revalidarLogistica();
}

export async function crearCamion(data: { placa: string; modelo?: string; capacidad?: string }) {
  await logistica();
  await prisma.camion.create({ data });
  revalidarLogistica();
}

export async function cambiarActivoCamion(id: string, activo: boolean) {
  await logistica();
  await prisma.camion.update({ where: { id }, data: { activo } });
  revalidarLogistica();
}
