import { NextResponse } from "next/server";
import { seedDemoUsers } from "@/lib/seed-demo-users";

// Ruta temporal para sembrar los usuarios demo en producción desde el
// navegador (sin necesitar acceso a terminal). Protegida con AUTH_SECRET
// como llave; bórrese después del primer uso.
export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key");

  if (!key || key !== process.env.AUTH_SECRET) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { creados, password } = await seedDemoUsers();

  return NextResponse.json({
    ok: true,
    mensaje: `${creados} usuarios demo listos. Contraseña: ${password}`,
  });
}
