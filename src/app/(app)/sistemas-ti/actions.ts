"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAcceso } from "@/lib/access";
import { folioTicket, folioDispositivo } from "@/lib/sistemas-ti";
import type { CategoriaTicket, PrioridadTicket, TipoDispositivo } from "@prisma/client";

async function sistemasTI() {
  const session = await requireAcceso("sistemas-ti");
  return session.user;
}

function revalidarSistemasTI() {
  revalidatePath("/sistemas-ti");
  revalidatePath("/sistemas-ti/dispositivos");
  revalidatePath("/sistemas-ti/vales");
  revalidatePath("/vigilancia/vales");
}

export async function crearTicket(data: {
  titulo: string;
  categoria: CategoriaTicket;
  prioridad: PrioridadTicket;
  reportadoPorId: string;
}) {
  await sistemasTI();
  const consecutivo = (await prisma.ticketSoporte.count()) + 1;

  await prisma.ticketSoporte.create({
    data: {
      folio: folioTicket(consecutivo),
      titulo: data.titulo,
      categoria: data.categoria,
      prioridad: data.prioridad,
      reportadoPorId: data.reportadoPorId,
    },
  });
  revalidarSistemasTI();
}

export async function resolverTicket(id: string) {
  const user = await sistemasTI();

  const ticket = await prisma.ticketSoporte.findUniqueOrThrow({ where: { id } });
  if (ticket.reportadoPorId === user.id) {
    throw new Error("No puedes resolver un ticket que tú mismo reportaste.");
  }

  await prisma.ticketSoporte.update({
    where: { id },
    data: { estado: "RESUELTO", resueltoPorId: user.id, resueltoAt: new Date() },
  });
  revalidarSistemasTI();
}

export async function crearDispositivo(data: {
  tipo: TipoDispositivo;
  marca: string;
  modelo: string;
  numeroSerie?: string;
  colaboradorId?: string;
}) {
  const user = await sistemasTI();
  const anio = new Date().getFullYear();
  const consecutivo =
    (await prisma.dispositivo.count({ where: { codigo: { startsWith: `DI-${anio}-` } } })) + 1;

  await prisma.dispositivo.create({
    data: {
      codigo: folioDispositivo(anio, consecutivo),
      tipo: data.tipo,
      marca: data.marca,
      modelo: data.modelo,
      numeroSerie: data.numeroSerie || undefined,
      colaboradorId: data.colaboradorId || undefined,
      fechaAsignacion: data.colaboradorId ? new Date() : undefined,
      asignadoPorId: user.id,
    },
  });
  revalidarSistemasTI();
}

export async function reasignarDispositivo(id: string, colaboradorId: string | null) {
  const user = await sistemasTI();
  await prisma.dispositivo.update({
    where: { id },
    data: {
      colaboradorId,
      fechaAsignacion: colaboradorId ? new Date() : null,
      asignadoPorId: user.id,
    },
  });
  revalidarSistemasTI();
}

async function siguienteFolioVale() {
  const now = new Date();
  const prefijo = `VS-${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const count = await prisma.valeSalida.count({ where: { folio: { startsWith: prefijo } } });
  return `${prefijo}-${String(count + 1).padStart(3, "0")}`;
}

// Paso 1 del flujo de la especificación (colaborador solicita); Sistemas/TI
// también puede capturarla en nombre de alguien (la misma acción que usa
// "Mi cuenta" → "Mi Dispositivo"). A diferencia del vale genérico de
// Vigilancia, este NO se autoriza al crearse: requiere el paso 2 explícito
// (autorizarValeDispositivo) antes de que Vigilancia pueda validarlo en la
// puerta.
export async function crearValeDispositivo(dispositivoId: string, colaboradorId: string) {
  const dispositivo = await prisma.dispositivo.findUniqueOrThrow({ where: { id: dispositivoId } });
  const folio = await siguienteFolioVale();

  await prisma.valeSalida.create({
    data: {
      folio,
      activo: `${dispositivo.marca} ${dispositivo.modelo} (${dispositivo.codigo})`,
      solicitanteId: colaboradorId,
      dispositivoId,
    },
  });
  revalidarSistemasTI();
}

// Paso 2: Sistemas/TI autoriza. Paso 3 (validar en la puerta) sigue siendo
// de Vigilancia, sobre la misma tabla de vales — sin cambios ahí.
export async function autorizarValeDispositivo(id: string) {
  const user = await sistemasTI();

  const vale = await prisma.valeSalida.findUniqueOrThrow({ where: { id } });
  if (vale.solicitanteId === user.id) {
    throw new Error("No puedes autorizar la salida de tu propio equipo.");
  }

  await prisma.valeSalida.update({
    where: { id },
    data: { estado: "AUTORIZADO", autorizadoPorId: user.id },
  });
  revalidarSistemasTI();
}
