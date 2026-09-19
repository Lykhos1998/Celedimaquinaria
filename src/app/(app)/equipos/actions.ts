"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAcceso } from "@/lib/access";
import { folioEquipo } from "@/lib/equipos";
import type { Combustible, EstadoEquipo } from "@prisma/client";

async function equipos() {
  const session = await requireAcceso("equipos");
  return session.user.id;
}

function revalidarEquipos() {
  revalidatePath("/equipos");
  revalidatePath("/equipos/tarifario");
  revalidatePath("/ventas");
}

export async function crearEquipo(data: {
  marca: string;
  modelo: string;
  anio: number;
  numeroSerie?: string;
  categoria: string;
  combustible: Combustible;
  altura?: number;
  horometro?: number;
  tarifaId?: string;
}) {
  const actualizadoPorId = await equipos();
  const consecutivo = (await prisma.equipo.count()) + 1;

  await prisma.equipo.create({
    data: {
      ...data,
      codigo: folioEquipo(consecutivo),
      actualizadoPorId,
    },
  });

  revalidarEquipos();
}

export async function cambiarEstadoEquipo(equipoId: string, estado: EstadoEquipo) {
  const actualizadoPorId = await equipos();
  await prisma.equipo.update({ where: { id: equipoId }, data: { estado, actualizadoPorId } });
  revalidarEquipos();
}

export async function actualizarHorometro(equipoId: string, horometro: number) {
  const actualizadoPorId = await equipos();
  await prisma.equipo.update({ where: { id: equipoId }, data: { horometro, actualizadoPorId } });
  revalidarEquipos();
}

export async function crearTarifa(data: {
  marca: string;
  modelo: string;
  clasificacion: string;
  alturaCapacidad?: string;
  precioMensual: number;
  precioDia1: number;
  precioDia7: number;
  precioDia15: number;
}) {
  await equipos();
  await prisma.tarifaEquipo.create({ data });
  revalidarEquipos();
}
