import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { MODULOS_POR_ROL } from "@/lib/roles";
import { AppShell } from "@/components/app-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const modulos = MODULOS_POR_ROL[session.user.rol];

  return (
    <AppShell modulos={modulos} nombre={session.user.nombre} rol={session.user.rol}>
      {children}
    </AppShell>
  );
}
