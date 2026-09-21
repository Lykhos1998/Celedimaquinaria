"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSesion } from "@/lib/access";
import { folioTicket } from "@/lib/sistemas-ti";
import { folioPermiso } from "@/lib/rh";
import type { CategoriaTicket, PrioridadTicket, TipoPermiso } from "@prisma/client";

function revalidarMiCuenta() {
  revalidatePath("/mi-cuenta");
  revalidatePath("/mi-cuenta/permisos");
  revalidatePath("/mi-cuenta/dispositivo");
  // Estas mismas tablas alimentan los módulos administradores.
  revalidatePath("/sistemas-ti");
  revalidatePath("/sistemas-ti/vales");
  revalidatePath("/rh/permisos");
  revalidatePath("/vigilancia/vales");
}

export async function crearMiTicket(data: {
  titulo: string;
  categoria: CategoriaTicket;
  prioridad: PrioridadTicket;
}) {
  const session = await requireSesion();
  const consecutivo = (await prisma.ticketSoporte.count()) + 1;

  await prisma.ticketSoporte.create({
    data: {
      folio: folioTicket(consecutivo),
      titulo: data.titulo,
      categoria: data.categoria,
      prioridad: data.prioridad,
      reportadoPorId: session.user.id,
    },
  });
  revalidarMiCuenta();
}

export async function crearMiPermiso(data: {
  tipo: TipoPermiso;
  fechaInicio: string;
  fechaFin: string;
  motivo?: string;
}) {
  const session = await requireSesion();
  const consecutivo = (await prisma.permiso.count()) + 1;

  await prisma.permiso.create({
    data: {
      folio: folioPermiso(consecutivo),
      colaboradorId: session.user.id,
      tipo: data.tipo,
      fechaInicio: new Date(data.fechaInicio),
      fechaFin: new Date(data.fechaFin),
      motivo: data.motivo || undefined,
      registradoPorId: session.user.id,
    },
  });
  revalidarMiCuenta();
}

async function siguienteFolioVale() {
  const now = new Date();
  const prefijo = `VS-${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const count = await prisma.valeSalida.count({ where: { folio: { startsWith: prefijo } } });
  return `${prefijo}-${String(count + 1).padStart(3, "0")}`;
}

// Paso 1 real del flujo de la especificación: ahora el colaborador dueño del
// equipo sí puede solicitar su propia salida, en vez de que Sistemas/TI lo
// capture por él. El resto del flujo no cambia: (2) Sistemas/TI autoriza,
// (3) Vigilancia valida en la puerta.
export async function solicitarSalidaMiDispositivo(dispositivoId: string) {
  const session = await requireSesion();
  const dispositivo = await prisma.dispositivo.findUniqueOrThrow({ where: { id: dispositivoId } });

  if (dispositivo.colaboradorId !== session.user.id) {
    throw new Error("Este dispositivo no está asignado a tu cuenta.");
  }

  const folio = await siguienteFolioVale();
  await prisma.valeSalida.create({
    data: {
      folio,
      activo: `${dispositivo.marca} ${dispositivo.modelo} (${dispositivo.codigo})`,
      solicitanteId: session.user.id,
      dispositivoId,
    },
  });
  revalidarMiCuenta();
}
