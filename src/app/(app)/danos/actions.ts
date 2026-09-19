"use server";

import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { requireAcceso } from "@/lib/access";
import { folioReporteInspeccion } from "@/lib/danos";
import type { SeveridadDanio } from "@prisma/client";

async function danos() {
  const session = await requireAcceso("danos");
  return session.user.id;
}

function revalidarDanos() {
  revalidatePath("/danos");
  revalidatePath("/danos/hallazgos");
  revalidatePath("/taller");
  revalidatePath("/ventas/contratos");
}

export async function crearReporte(data: { equipoId: string; contratoId?: string; observaciones?: string }) {
  const inspeccionadoPorId = await danos();
  const consecutivo = (await prisma.reporteInspeccion.count()) + 1;

  await prisma.reporteInspeccion.create({
    data: {
      folio: folioReporteInspeccion(consecutivo),
      equipoId: data.equipoId,
      contratoId: data.contratoId || undefined,
      observaciones: data.observaciones || undefined,
      inspeccionadoPorId,
    },
  });

  revalidarDanos();
}

const MAX_FOTO_BYTES = 5 * 1024 * 1024;

async function guardarFoto(foto: File | null): Promise<string | undefined> {
  if (!foto || foto.size === 0) return undefined;
  if (!foto.type.startsWith("image/")) {
    throw new Error("La evidencia debe ser una imagen.");
  }
  if (foto.size > MAX_FOTO_BYTES) {
    throw new Error("La imagen no puede pesar más de 5 MB.");
  }

  const extension = foto.type.split("/")[1] || "jpg";
  const nombreArchivo = `${randomUUID()}.${extension}`;
  const directorio = path.join(process.cwd(), "public", "uploads", "danos");
  await mkdir(directorio, { recursive: true });
  await writeFile(path.join(directorio, nombreArchivo), Buffer.from(await foto.arrayBuffer()));

  return `/uploads/danos/${nombreArchivo}`;
}

export async function crearDanio(formData: FormData) {
  const registradoPorId = await danos();

  const reporteId = String(formData.get("reporteId"));
  const tipo = String(formData.get("tipo"));
  const severidad = String(formData.get("severidad")) as SeveridadDanio;
  const descripcion = formData.get("descripcion") ? String(formData.get("descripcion")) : undefined;
  const costoEstimadoRaw = formData.get("costoEstimado");
  const costoEstimado = costoEstimadoRaw ? Number(costoEstimadoRaw) : undefined;
  const foto = formData.get("foto") as File | null;

  const fotoUrl = await guardarFoto(foto);

  await prisma.danio.create({
    data: { reporteId, tipo, severidad, descripcion, costoEstimado, fotoUrl, registradoPorId },
  });

  revalidarDanos();
}
