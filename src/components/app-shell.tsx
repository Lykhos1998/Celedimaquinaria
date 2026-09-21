"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import type { ModuloSlug } from "@/lib/roles";
import type { Rol } from "@prisma/client";

export function AppShell({
  modulos,
  nombre,
  rol,
  children,
}: {
  modulos: ModuloSlug[];
  nombre: string;
  rol: Rol;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar modulos={modulos} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header nombre={nombre} rol={rol} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
