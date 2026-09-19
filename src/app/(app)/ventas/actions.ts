"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAcceso } from "@/lib/access";
import { folioContrato } from "@/lib/comercial";
import type { EtapaLead, Temperatura } from "@prisma/client";

async function ventas() {
  const session = await requireAcceso("ventas");
  return session.user.id;
}

function revalidarComercial() {
  revalidatePath("/ventas");
  revalidatePath("/ventas/mi-cartera");
  revalidatePath("/ventas/contratos");
  revalidatePath("/marketing");
  revalidatePath("/marketing/leads");
  revalidatePath("/equipos");
}

export async function avanzarEtapa(leadId: string, etapa: EtapaLead) {
  await ventas();
  await prisma.lead.update({ where: { id: leadId }, data: { etapa } });
  revalidarComercial();
}

export async function actualizarTemperatura(leadId: string, temperatura: Temperatura) {
  await ventas();
  await prisma.lead.update({ where: { id: leadId }, data: { temperatura } });
  revalidarComercial();
}

export async function asignarAsesor(leadId: string, asesorId: string) {
  await ventas();
  await prisma.lead.update({ where: { id: leadId }, data: { asesorId } });
  revalidarComercial();
}

export async function marcarGanado(
  leadId: string,
  data: { valorMensual: number; fechaInicio: string; fechaFin: string; equipoId?: string },
) {
  const userId = await ventas();
  const lead = await prisma.lead.findUniqueOrThrow({ where: { id: leadId } });

  const anio = new Date().getFullYear();
  const consecutivo = (await prisma.contrato.count({ where: { folio: { startsWith: `CTR-${anio}-` } } })) + 1;

  await prisma.$transaction(async (tx) => {
    await tx.lead.update({
      where: { id: leadId },
      data: { etapa: "GANADO", cerradoAt: new Date() },
    });
    await tx.contrato.create({
      data: {
        folio: folioContrato(anio, consecutivo),
        leadId,
        asesorId: lead.asesorId ?? userId,
        valorMensual: data.valorMensual,
        fechaInicio: new Date(data.fechaInicio),
        fechaFin: new Date(data.fechaFin),
        equipoId: data.equipoId || undefined,
      },
    });
    if (data.equipoId) {
      await tx.equipo.update({
        where: { id: data.equipoId },
        data: { estado: "RENTADO", actualizadoPorId: userId },
      });
    }
  });

  revalidarComercial();
}

export async function marcarPerdido(leadId: string, motivoPerdida: string, valorPerdido?: number) {
  await ventas();
  await prisma.lead.update({
    where: { id: leadId },
    data: { etapa: "PERDIDO", cerradoAt: new Date(), motivoPerdida, valorPerdido },
  });
  revalidarComercial();
}

export async function cancelarContrato(contratoId: string) {
  await ventas();
  await prisma.contrato.update({ where: { id: contratoId }, data: { cancelado: true } });
  revalidarComercial();
}
