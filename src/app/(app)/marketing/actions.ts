"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAcceso } from "@/lib/access";
import { folioLead } from "@/lib/comercial";
import type { CanalLead, TipoTrabajo } from "@prisma/client";

async function marketing() {
  const session = await requireAcceso("marketing");
  return session.user.id;
}

export async function crearLead(data: {
  nombre: string;
  telefono?: string;
  email?: string;
  canal: CanalLead;
  tipoTrabajo: TipoTrabajo;
  ubicacion?: string;
  valorEstimado?: number;
  asesorId?: string;
}) {
  const creadoPorId = await marketing();

  if (data.asesorId) {
    const asesor = await prisma.user.findUniqueOrThrow({ where: { id: data.asesorId } });
    if (asesor.rol !== "ASESOR_VENTAS") {
      throw new Error("Solo se puede asignar un lead a un usuario con rol Asesor de Ventas.");
    }
  }

  const consecutivo = (await prisma.lead.count()) + 1;

  await prisma.lead.create({
    data: {
      ...data,
      folio: folioLead(consecutivo),
      creadoPorId,
    },
  });

  revalidatePath("/marketing");
  revalidatePath("/marketing/leads");
  revalidatePath("/ventas");
}

export async function registrarGasto(data: { plataforma: string; canal?: CanalLead; monto: number }) {
  const registradoPorId = await marketing();
  await prisma.gastoPublicitario.create({ data: { ...data, registradoPorId } });
  revalidatePath("/marketing/gastos");
  revalidatePath("/marketing");
}
