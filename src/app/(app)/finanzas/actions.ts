"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAcceso } from "@/lib/access";
import { folioCuentaCobrar } from "@/lib/finanzas";
import type { ConceptoCobro } from "@prisma/client";

async function finanzas() {
  const session = await requireAcceso("finanzas");
  return session.user;
}

function revalidarFinanzas() {
  revalidatePath("/finanzas");
  revalidatePath("/finanzas/por-pagar");
}

export async function crearCuentaCobrar(data: {
  concepto: ConceptoCobro;
  descripcion: string;
  monto: number;
  fechaVencimiento: string;
  contratoId?: string;
  danioId?: string;
}) {
  const user = await finanzas();
  const anio = new Date().getFullYear();
  const consecutivo =
    (await prisma.cuentaCobrar.count({ where: { folio: { startsWith: `CXC-${anio}-` } } })) + 1;

  await prisma.cuentaCobrar.create({
    data: {
      concepto: data.concepto,
      descripcion: data.descripcion,
      monto: data.monto,
      fechaVencimiento: new Date(data.fechaVencimiento),
      contratoId: data.contratoId || undefined,
      danioId: data.danioId || undefined,
      folio: folioCuentaCobrar(anio, consecutivo),
      registradoPorId: user.id,
    },
  });

  revalidarFinanzas();
}

export async function marcarCuentaCobrada(id: string) {
  const user = await finanzas();
  await prisma.cuentaCobrar.update({
    where: { id },
    data: { cobrada: true, fechaCobro: new Date(), cobradoPorId: user.id },
  });
  revalidarFinanzas();
}

export async function marcarOrdenCompraPagada(id: string) {
  const user = await finanzas();
  await prisma.ordenCompra.update({
    where: { id },
    data: { pagada: true, fechaPago: new Date(), pagadoPorId: user.id },
  });
  revalidarFinanzas();
}
