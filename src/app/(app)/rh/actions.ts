"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAcceso } from "@/lib/access";
import { folioPermiso, folioNomina, diasAsistidos } from "@/lib/rh";
import type { Rol, TipoPermiso } from "@prisma/client";

async function rh() {
  const session = await requireAcceso("rh");
  return session.user;
}

function revalidarRH() {
  revalidatePath("/rh");
  revalidatePath("/rh/permisos");
  revalidatePath("/rh/nomina");
}

export async function crearColaborador(data: {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
}) {
  const user = await rh();

  // Solo Gerencia puede dar de alta a otro usuario con rol Gerencia — si no,
  // cualquiera con acceso a RH podría crearse un "dueño" nuevo.
  if (data.rol === "GERENCIA" && user.rol !== "GERENCIA") {
    throw new Error("Solo Gerencia puede dar de alta a un usuario con rol Gerencia.");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  await prisma.user.create({
    data: { nombre: data.nombre, email: data.email, rol: data.rol, passwordHash },
  });
  revalidarRH();
}

export async function toggleActivoColaborador(id: string, activo: boolean) {
  const user = await rh();

  // Nadie se da de baja a sí mismo desde aquí (te deja sin acceso sin que
  // nadie más lo note), y solo Gerencia puede dar de baja a otro Gerencia.
  if (id === user.id) {
    throw new Error("No puedes dar de baja tu propia cuenta.");
  }

  const colaborador = await prisma.user.findUniqueOrThrow({ where: { id } });
  if (colaborador.rol === "GERENCIA" && user.rol !== "GERENCIA") {
    throw new Error("Solo Gerencia puede dar de baja a otro usuario con rol Gerencia.");
  }

  await prisma.user.update({ where: { id }, data: { activo } });
  revalidarRH();
}

export async function crearPermiso(data: {
  colaboradorId: string;
  tipo: TipoPermiso;
  fechaInicio: string;
  fechaFin: string;
  motivo?: string;
}) {
  const user = await rh();
  const consecutivo = (await prisma.permiso.count()) + 1;

  await prisma.permiso.create({
    data: {
      folio: folioPermiso(consecutivo),
      colaboradorId: data.colaboradorId,
      tipo: data.tipo,
      fechaInicio: new Date(data.fechaInicio),
      fechaFin: new Date(data.fechaFin),
      motivo: data.motivo || undefined,
      registradoPorId: user.id,
    },
  });
  revalidarRH();
}

export async function resolverPermiso(id: string, estado: "APROBADO" | "RECHAZADO") {
  const user = await rh();

  const permiso = await prisma.permiso.findUniqueOrThrow({ where: { id } });
  if (permiso.colaboradorId === user.id) {
    throw new Error("No puedes aprobar o rechazar tu propia solicitud de permiso.");
  }

  await prisma.permiso.update({
    where: { id },
    data: { estado, resueltoPorId: user.id },
  });
  revalidarRH();
}

export async function generarNomina(data: {
  colaboradorId: string;
  periodoInicio: string;
  periodoFin: string;
  sueldoPeriodo: number;
}) {
  const user = await rh();

  const colaborador = await prisma.user.findUniqueOrThrow({ where: { id: data.colaboradorId } });
  if (colaborador.rol === "GERENCIA") {
    throw new Error("Gerencia no está en nómina por asistencia.");
  }

  const periodoInicio = new Date(data.periodoInicio);
  const periodoFin = new Date(data.periodoFin);

  const checadas = await prisma.asistenciaRegistro.findMany({
    where: {
      colaboradorId: data.colaboradorId,
      tipo: "ENTRADA",
      timestamp: { gte: periodoInicio, lte: periodoFin },
    },
    select: { timestamp: true },
  });

  const anio = periodoFin.getFullYear();
  const consecutivo = (await prisma.nomina.count({ where: { folio: { startsWith: `NOM-${anio}-` } } })) + 1;

  await prisma.nomina.create({
    data: {
      folio: folioNomina(anio, consecutivo),
      colaboradorId: data.colaboradorId,
      periodoInicio,
      periodoFin,
      diasAsistidos: diasAsistidos(checadas),
      sueldoPeriodo: data.sueldoPeriodo,
      generadoPorId: user.id,
    },
  });
  revalidarRH();
}

export async function marcarNominaPagada(id: string) {
  const user = await rh();
  await prisma.nomina.update({
    where: { id },
    data: { pagada: true, fechaPago: new Date(), pagadoPorId: user.id },
  });
  revalidarRH();
}
