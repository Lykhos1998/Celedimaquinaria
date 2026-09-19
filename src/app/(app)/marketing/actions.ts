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
