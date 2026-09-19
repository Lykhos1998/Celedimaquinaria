import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { MODULOS_POR_ROL, moduloInicial, type ModuloSlug } from "@/lib/roles";

export async function requireAcceso(modulo: ModuloSlug) {
  const session = await auth();
  if (!session) redirect("/login");

  if (!MODULOS_POR_ROL[session.user.rol].includes(modulo)) {
    redirect(`/${moduloInicial(session.user.rol)}`);
  }

  return session;
}
