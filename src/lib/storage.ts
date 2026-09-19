import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const MAX_BYTES = 5 * 1024 * 1024;

// Sube un archivo a Vercel Blob cuando BLOB_READ_WRITE_TOKEN está configurado
// (producción); si no, lo guarda en disco bajo public/uploads/<carpeta> para
// desarrollo local, donde Vercel Blob normalmente no está disponible.
export async function guardarArchivo(archivo: File | null, carpeta: string): Promise<string | undefined> {
  if (!archivo || archivo.size === 0) return undefined;
  if (!archivo.type.startsWith("image/")) {
    throw new Error("El archivo debe ser una imagen.");
  }
  if (archivo.size > MAX_BYTES) {
    throw new Error("La imagen no puede pesar más de 5 MB.");
  }

  const extension = archivo.type.split("/")[1] || "jpg";
  const nombreArchivo = `${carpeta}/${randomUUID()}.${extension}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(nombreArchivo, archivo, { access: "public" });
    return blob.url;
  }

  const directorio = path.join(process.cwd(), "public", "uploads", carpeta);
  await mkdir(directorio, { recursive: true });
  const nombreLocal = nombreArchivo.split("/").pop()!;
  await writeFile(path.join(directorio, nombreLocal), Buffer.from(await archivo.arrayBuffer()));

  return `/uploads/${carpeta}/${nombreLocal}`;
}
