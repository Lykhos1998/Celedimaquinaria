"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAcceso } from "@/lib/access";
import { procesarEscaneoQR } from "@/lib/logistica";
import type { EstadoVale, SeveridadIncidente, TipoChecada, MovimientoQR } from "@prisma/client";

async function vigilante() {
  const session = await requireAcceso("vigilancia");
  return session.user.id;
}

export async function registrarChecada(colaboradorId: string, tipo: TipoChecada) {
  const registradoPorId = await vigilante();
  await prisma.asistenciaRegistro.create({
    data: { colaboradorId, tipo, registradoPorId },
  });
  revalidatePath("/vigilancia");
}

export async function registrarQR(data: {
  placa: string;
  codigoQR: string;
  movimiento: MovimientoQR;
  destino?: string;
}) {
  const registradoPorId = await vigilante();
  await prisma.qRVehiculo.create({
    data: { ...data, registradoPorId },
  });
  await procesarEscaneoQR(data.placa, data.movimiento);
  revalidatePath("/vigilancia/qr");
  revalidatePath("/logistica");
  revalidatePath("/equipos");
}

async function siguienteFolioVale() {
  const now = new Date();
  const prefijo = `VS-${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const count = await prisma.valeSalida.count({
    where: { folio: { startsWith: prefijo } },
  });
  return `${prefijo}-${String(count + 1).padStart(3, "0")}`;
}

export async function crearValeSalida(activo: string, solicitanteId: string) {
  const registradoPorId = await vigilante();
  const folio = await siguienteFolioVale();
  await prisma.valeSalida.create({
    data: {
      folio,
      activo,
      solicitanteId,
      autorizadoPorId: registradoPorId,
    },
  });
  revalidatePath("/vigilancia/vales");
}

export async function avanzarVale(id: string, estado: EstadoVale) {
  const registradoPorId = await vigilante();
  const data: {
    estado: EstadoVale;
    validadoPorId?: string;
    fechaSalida?: Date;
    fechaRetorno?: Date;
  } = { estado };

  if (estado === "EN_SALIDA") {
    data.validadoPorId = registradoPorId;
    data.fechaSalida = new Date();
  }
  if (estado === "RETORNADO") {
    data.fechaRetorno = new Date();
  }

  await prisma.valeSalida.update({ where: { id }, data });
  revalidatePath("/vigilancia/vales");
}

export async function registrarIncidente(descripcion: string, severidad: SeveridadIncidente) {
  const registradoPorId = await vigilante();
  await prisma.incidenteSeguridad.create({
    data: { descripcion, severidad, registradoPorId },
  });
  revalidatePath("/vigilancia/incidentes");
}
