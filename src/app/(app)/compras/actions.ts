"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAcceso } from "@/lib/access";
import { folioOrdenCompra } from "@/lib/compras";
import type { AreaSolicitante } from "@prisma/client";

async function compras() {
  const session = await requireAcceso("compras");
  return session.user;
}

// Dirección (rol Gerencia) es quien aprueba siempre, sin importar el monto.
async function direccion() {
  const user = await compras();
  if (user.rol !== "GERENCIA") {
    throw new Error("Solo Dirección puede aprobar o rechazar órdenes de compra.");
  }
  return user.id;
}

function revalidarCompras() {
  revalidatePath("/compras");
  revalidatePath("/compras/proveedores");
  revalidatePath("/taller");
  revalidatePath("/taller/refacciones");
}

export async function crearProveedor(data: {
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  categoria?: string;
}) {
  await compras();
  await prisma.proveedor.create({ data });
  revalidarCompras();
}

export async function crearOrdenCompra(data: {
  proveedorId: string;
  descripcion: string;
  monto: number;
  area: AreaSolicitante;
  refaccionId?: string;
}) {
  const user = await compras();
  const anio = new Date().getFullYear();
  const consecutivo =
    (await prisma.ordenCompra.count({ where: { folio: { startsWith: `OC-${anio}-` } } })) + 1;

  await prisma.ordenCompra.create({
    data: {
      ...data,
      folio: folioOrdenCompra(anio, consecutivo),
      registradoPorId: user.id,
    },
  });

  revalidarCompras();
}

export async function aprobarOrdenCompra(id: string) {
  const aprobadoPorId = await direccion();
  await prisma.ordenCompra.update({
    where: { id },
    data: { estado: "APROBADA", aprobadoPorId, fechaAprobacion: new Date() },
  });
  revalidarCompras();
}

export async function rechazarOrdenCompra(id: string) {
  const aprobadoPorId = await direccion();
  await prisma.ordenCompra.update({
    where: { id },
    data: { estado: "RECHAZADA", aprobadoPorId, fechaAprobacion: new Date() },
  });
  revalidarCompras();
}

export async function marcarOrdenRecibida(id: string) {
  await compras();
  const orden = await prisma.ordenCompra.findUniqueOrThrow({ where: { id } });

  await prisma.$transaction(async (tx) => {
    await tx.ordenCompra.update({ where: { id }, data: { estado: "RECIBIDA" } });
    if (orden.refaccionId) {
      await tx.solicitudRefaccion.update({
        where: { id: orden.refaccionId },
        data: { estado: "RECIBIDA" },
      });
    }
  });

  revalidarCompras();
}
