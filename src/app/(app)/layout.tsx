import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { MODULOS_POR_ROL } from "@/lib/roles";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const modulos = MODULOS_POR_ROL[session.user.rol];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar modulos={modulos} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header nombre={session.user.nombre} rol={session.user.rol} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
