"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAcceso } from "@/lib/access";
import { folioEquipo } from "@/lib/equipos";
import type { Combustible, EstadoEquipo } from "@prisma/client";

async function equipos() {
  const session = await requireAcceso("equipos");
  return session.user;
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
  const user = await equipos();
  const consecutivo = (await prisma.equipo.count()) + 1;

  await prisma.equipo.create({
    data: {
      ...data,
      codigo: folioEquipo(consecutivo),
      actualizadoPorId: user.id,
    },
  });

  revalidarEquipos();
}

export async function cambiarEstadoEquipo(equipoId: string, estado: EstadoEquipo) {
  const user = await equipos();
  await prisma.equipo.update({ where: { id: equipoId }, data: { estado, actualizadoPorId: user.id } });
  revalidarEquipos();
}

export async function actualizarHorometro(equipoId: string, horometro: number) {
  const user = await equipos();
  await prisma.equipo.update({ where: { id: equipoId }, data: { horometro, actualizadoPorId: user.id } });
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
  const user = await equipos();
  if (user.rol !== "GERENCIA" && user.rol !== "ASESOR_VENTAS") {
    throw new Error("Solo Ventas o Gerencia pueden definir tarifas de renta.");
  }
  await prisma.tarifaEquipo.create({ data });
  revalidarEquipos();
}
